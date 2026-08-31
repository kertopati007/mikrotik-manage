<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import {
    Activity,
    CheckCircle2,
    Edit2,
    Flame,
    Loader2,
    Plus,
    Power,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Trash2,
    XCircle,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import FirewallFilterModal from '@/components/firewall/FirewallFilterModal.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { FirewallAddressList, FirewallFilterRule } from '@/types/router';

const props = defineProps<{
    rules: FirewallFilterRule[];
    interfaces?: Array<{ name: string }>;
    addressLists?: FirewallAddressList[];
}>();

const searchQuery = ref('');
const selectedChain = ref<string>('all');
const isModalOpen = ref(false);
const editingRule = ref<FirewallFilterRule | null>(null);
const actionInProgress = ref<string | null>(null);

const formatBytes = (bytesStr?: string | number) => {
    if (!bytesStr) return '0 B';
    const bytes = typeof bytesStr === 'string' ? parseInt(bytesStr, 10) : bytesStr;
    if (isNaN(bytes) || bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

const formatPackets = (pStr?: string | number) => {
    if (!pStr) return '0';
    const p = typeof pStr === 'string' ? parseInt(pStr, 10) : pStr;
    if (isNaN(p)) return '0';
    return p.toLocaleString();
};

const getActionColor = (action: string) => {
    const a = (action || '').toLowerCase();
    if (a === 'accept') return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    if (a === 'drop') return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
    if (a === 'reject') return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    if (a === 'fasttrack-connection') return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
    if (a === 'log') return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
    return 'bg-muted text-muted-foreground border-border';
};

const getChainColor = (chain: string) => {
    const c = (chain || '').toLowerCase();
    if (c === 'input') return 'border-sky-500/40 text-sky-600 dark:text-sky-400 bg-sky-500/10';
    if (c === 'forward') return 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10';
    if (c === 'output') return 'border-indigo-500/40 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10';
    return 'border-border text-muted-foreground';
};

const filteredRules = computed(() => {
    let list = props.rules || [];

    if (selectedChain.value !== 'all') {
        list = list.filter((r) => (r.chain || '').toLowerCase() === selectedChain.value);
    }

    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase();
        list = list.filter((r) =>
            (r.comment && r.comment.toLowerCase().includes(q)) ||
            (r.action && r.action.toLowerCase().includes(q)) ||
            (r.chain && r.chain.toLowerCase().includes(q)) ||
            (r.protocol && r.protocol.toLowerCase().includes(q)) ||
            (r['src-address'] && r['src-address'].toLowerCase().includes(q)) ||
            (r['dst-address'] && r['dst-address'].toLowerCase().includes(q)) ||
            (r['dst-port'] && r['dst-port'].toLowerCase().includes(q)) ||
            (r['src-address-list'] && r['src-address-list'].toLowerCase().includes(q)) ||
            (r['dst-address-list'] && r['dst-address-list'].toLowerCase().includes(q)) ||
            (r['in-interface'] && r['in-interface'].toLowerCase().includes(q)) ||
            (r['out-interface'] && r['out-interface'].toLowerCase().includes(q))
        );
    }

    return list;
});

const openAddModal = () => {
    editingRule.value = null;
    isModalOpen.value = true;
};

const openEditModal = (rule: FirewallFilterRule) => {
    editingRule.value = rule;
    isModalOpen.value = true;
};

const toggleRule = (rule: FirewallFilterRule) => {
    const id = rule['.id'];
    if (!id) return;

    const isCurrentlyDisabled = rule.disabled === 'true' || rule.disabled === true;
    actionInProgress.value = id;

    router.post(
        `/firewall/filter/${id}/toggle`,
        { enable: isCurrentlyDisabled },
        {
            preserveScroll: true,
            onFinish: () => {
                actionInProgress.value = null;
            },
        }
    );
};

const deleteRule = (rule: FirewallFilterRule) => {
    const id = rule['.id'];
    if (!id) return;

    if (confirm(`Are you sure you want to delete rule [${rule.chain}] ${rule.action} (${rule.comment || id})?`)) {
        actionInProgress.value = id;
        router.delete(`/firewall/filter/${id}`, {
            preserveScroll: true,
            onFinish: () => {
                actionInProgress.value = null;
            },
        });
    }
};
</script>

<template>
    <Card class="border-border/80 bg-card/60 shadow-xs backdrop-blur">
        <CardHeader class="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle class="flex items-center gap-2 text-base font-bold">
                    <ShieldCheck class="h-4 w-4 text-primary" />
                    <span>Firewall Filter Rules</span>
                    <Badge variant="secondary" class="text-xs">
                        {{ rules?.length || 0 }}
                    </Badge>
                </CardTitle>
                <p class="text-xs text-muted-foreground">
                    Inspect, accept, drop, or log packets entering or passing through the router.
                </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <!-- Chain Filter Pill -->
                <div class="flex items-center rounded-md border bg-muted/40 p-0.5 text-xs">
                    <button
                        type="button"
                        v-for="c in ['all', 'input', 'forward', 'output']"
                        :key="c"
                        @click="selectedChain = c"
                        class="rounded px-2.5 py-1 font-medium capitalize transition-colors"
                        :class="
                            selectedChain === c
                                ? 'bg-background text-foreground shadow-2xs font-semibold'
                                : 'text-muted-foreground hover:text-foreground'
                        "
                    >
                        {{ c }}
                    </button>
                </div>

                <!-- Search Input -->
                <div class="relative w-40 sm:w-56">
                    <Search class="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        v-model="searchQuery"
                        placeholder="Search rules, IP, port..."
                        class="h-8 pl-8 text-xs"
                    />
                </div>

                <!-- Add Button -->
                <Button size="sm" class="h-8 gap-1 text-xs" @click="openAddModal">
                    <Plus class="h-3.5 w-3.5" />
                    <span>Add Filter Rule</span>
                </Button>
            </div>
        </CardHeader>

        <CardContent class="p-0">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="border-b bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <tr>
                            <th class="py-2.5 pl-4 pr-2 w-12 text-center">Flags</th>
                            <th class="px-3 py-2.5">Action</th>
                            <th class="px-3 py-2.5">Chain</th>
                            <th class="px-3 py-2.5">Match Criteria</th>
                            <th class="px-3 py-2.5">In / Out</th>
                            <th class="px-3 py-2.5">Comment / Note</th>
                            <th class="px-3 py-2.5 text-right">Packets / Bytes</th>
                            <th class="py-2.5 pl-3 pr-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/60">
                        <tr
                            v-for="(rule, idx) in filteredRules"
                            :key="rule['.id'] || idx"
                            class="transition-colors hover:bg-muted/30"
                            :class="{
                                'opacity-50 bg-muted/20': rule.disabled === 'true' || rule.disabled === true,
                            }"
                        >
                            <!-- Flags Column (X, D, I) -->
                            <td class="py-2.5 pl-4 pr-2 text-center">
                                <div class="flex items-center justify-center gap-1 font-mono text-[11px] font-bold">
                                    <span
                                        v-if="rule.disabled === 'true' || rule.disabled === true"
                                        class="text-rose-500"
                                        title="Disabled"
                                    >X</span>
                                    <span
                                        v-if="rule.dynamic === 'true' || rule.dynamic === true"
                                        class="text-sky-500"
                                        title="Dynamic"
                                    >D</span>
                                    <span
                                        v-if="rule.invalid === 'true' || rule.invalid === true"
                                        class="text-amber-500"
                                        title="Invalid"
                                    >I</span>
                                    <span
                                        v-if="
                                            (rule.disabled !== 'true' && rule.disabled !== true) &&
                                            (rule.dynamic !== 'true' && rule.dynamic !== true) &&
                                            (rule.invalid !== 'true' && rule.invalid !== true)
                                        "
                                        class="text-muted-foreground/30 font-mono text-[10px]"
                                    >
                                        {{ idx }}
                                    </span>
                                </div>
                            </td>

                            <!-- Action Column -->
                            <td class="px-3 py-2.5 font-medium">
                                <Badge
                                    variant="outline"
                                    class="border font-mono text-[11px] font-bold capitalize"
                                    :class="getActionColor(rule.action)"
                                >
                                    {{ rule.action }}
                                </Badge>
                            </td>

                            <!-- Chain Column -->
                            <td class="px-3 py-2.5">
                                <Badge
                                    variant="outline"
                                    class="text-[10px] uppercase font-mono"
                                    :class="getChainColor(rule.chain)"
                                >
                                    {{ rule.chain }}
                                </Badge>
                            </td>

                            <!-- Match Criteria Details -->
                            <td class="px-3 py-2.5">
                                <div class="space-y-0.5">
                                    <!-- Protocol & Ports -->
                                    <div v-if="rule.protocol || rule['dst-port'] || rule['src-port']" class="flex items-center gap-1.5 font-mono text-[11px]">
                                        <span v-if="rule.protocol" class="font-bold text-foreground">{{ rule.protocol }}</span>
                                        <span v-if="rule['dst-port']" class="text-primary font-semibold">:{{ rule['dst-port'] }} (dst)</span>
                                        <span v-if="rule['src-port']" class="text-muted-foreground">:{{ rule['src-port'] }} (src)</span>
                                    </div>

                                    <!-- IP Addresses -->
                                    <div v-if="rule['src-address'] || rule['dst-address']" class="flex flex-wrap gap-1 font-mono text-[10px] text-muted-foreground">
                                        <span v-if="rule['src-address']">src: <b class="text-foreground">{{ rule['src-address'] }}</b></span>
                                        <span v-if="rule['dst-address']">dst: <b class="text-foreground">{{ rule['dst-address'] }}</b></span>
                                    </div>

                                    <!-- Address Lists -->
                                    <div v-if="rule['src-address-list'] || rule['dst-address-list']" class="flex flex-wrap gap-1 text-[10px]">
                                        <Badge v-if="rule['src-address-list']" variant="secondary" class="h-4 px-1 text-[9px] font-mono">
                                            src-list: {{ rule['src-address-list'] }}
                                        </Badge>
                                        <Badge v-if="rule['dst-address-list']" variant="secondary" class="h-4 px-1 text-[9px] font-mono">
                                            dst-list: {{ rule['dst-address-list'] }}
                                        </Badge>
                                    </div>

                                    <!-- Connection State -->
                                    <div v-if="rule['connection-state']" class="text-[10px] text-muted-foreground font-mono">
                                        state: <span class="italic text-foreground/80">{{ rule['connection-state'] }}</span>
                                    </div>

                                    <!-- Catch all fallback -->
                                    <div v-if="!rule.protocol && !rule['dst-port'] && !rule['src-address'] && !rule['dst-address'] && !rule['src-address-list'] && !rule['dst-address-list'] && !rule['connection-state']" class="text-[10px] text-muted-foreground italic">
                                        (all traffic)
                                    </div>
                                </div>
                            </td>

                            <!-- In / Out Interfaces -->
                            <td class="px-3 py-2.5 font-mono text-[11px]">
                                <div class="flex flex-col gap-0.5">
                                    <span v-if="rule['in-interface']" class="text-sky-600 dark:text-sky-400">
                                        in: <b>{{ rule['in-interface'] }}</b>
                                    </span>
                                    <span v-if="rule['out-interface']" class="text-indigo-600 dark:text-indigo-400">
                                        out: <b>{{ rule['out-interface'] }}</b>
                                    </span>
                                    <span v-if="!rule['in-interface'] && !rule['out-interface']" class="text-muted-foreground text-[10px]">
                                        * (any)
                                    </span>
                                </div>
                            </td>

                            <!-- Comment -->
                            <td class="px-3 py-2.5">
                                <span v-if="rule.comment" class="text-[11px] font-medium text-foreground/90">
                                    {{ rule.comment }}
                                </span>
                                <span v-else class="text-[10px] text-muted-foreground">-</span>
                            </td>

                            <!-- Bytes & Packets -->
                            <td class="px-3 py-2.5 text-right font-mono text-[11px]">
                                <div class="flex flex-col items-end">
                                    <span class="font-bold text-foreground">{{ formatBytes(rule.bytes) }}</span>
                                    <span class="text-[10px] text-muted-foreground">{{ formatPackets(rule.packets) }} pkts</span>
                                </div>
                            </td>

                            <!-- Actions -->
                            <td class="py-2.5 pl-3 pr-4 text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <!-- Enable / Disable Toggle -->
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="h-7 w-7 text-muted-foreground hover:text-foreground"
                                        :title="rule.disabled === 'true' || rule.disabled === true ? 'Enable Rule' : 'Disable Rule'"
                                        @click="toggleRule(rule)"
                                        :disabled="actionInProgress === rule['.id']"
                                    >
                                        <Loader2 v-if="actionInProgress === rule['.id']" class="h-3.5 w-3.5 animate-spin" />
                                        <Power
                                            v-else
                                            class="h-3.5 w-3.5"
                                            :class="rule.disabled === 'true' || rule.disabled === true ? 'text-muted-foreground' : 'text-emerald-500'"
                                        />
                                    </Button>

                                    <!-- Edit Button -->
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="h-7 w-7 text-muted-foreground hover:text-foreground"
                                        title="Edit Rule"
                                        @click="openEditModal(rule)"
                                    >
                                        <Edit2 class="h-3.5 w-3.5" />
                                    </Button>

                                    <!-- Delete Button -->
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="h-7 w-7 text-rose-500/80 hover:bg-rose-500/10 hover:text-rose-600"
                                        title="Delete Rule"
                                        @click="deleteRule(rule)"
                                        :disabled="actionInProgress === rule['.id']"
                                    >
                                        <Trash2 class="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="filteredRules.length === 0">
                            <td colspan="8" class="py-8 text-center text-xs text-muted-foreground">
                                No firewall filter rules found matching your filters.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </CardContent>
    </Card>

    <!-- Filter Modal (Add / Edit) -->
    <FirewallFilterModal
        v-model:open="isModalOpen"
        :rule-to-edit="editingRule"
        :interfaces="interfaces"
        :address-lists="addressLists"
    />
</template>
