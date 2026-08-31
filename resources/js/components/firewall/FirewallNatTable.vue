<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import {
    ArrowRight,
    ArrowRightLeft,
    CheckCircle2,
    Edit2,
    Globe,
    Loader2,
    Network,
    Plus,
    Power,
    Search,
    Trash2,
    XCircle,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import FirewallNatModal from '@/components/firewall/FirewallNatModal.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { FirewallNatRule } from '@/types/router';

const props = defineProps<{
    rules: FirewallNatRule[];
    interfaces?: Array<{ name: string }>;
}>();

const searchQuery = ref('');
const selectedChain = ref<string>('all');
const isModalOpen = ref(false);
const editingRule = ref<FirewallNatRule | null>(null);
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
    if (a === 'masquerade') return 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
    if (a === 'dst-nat') return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    if (a === 'src-nat') return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    if (a === 'redirect') return 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30';
    if (a === 'drop') return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
    return 'bg-muted text-muted-foreground border-border';
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
            (r['to-addresses'] && r['to-addresses'].toLowerCase().includes(q)) ||
            (r['dst-port'] && r['dst-port'].toLowerCase().includes(q)) ||
            (r['to-ports'] && r['to-ports'].toLowerCase().includes(q)) ||
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

const openEditModal = (rule: FirewallNatRule) => {
    editingRule.value = rule;
    isModalOpen.value = true;
};

const toggleRule = (rule: FirewallNatRule) => {
    const id = rule['.id'];
    if (!id) return;

    const isCurrentlyDisabled = rule.disabled === 'true' || rule.disabled === true;
    actionInProgress.value = id;

    router.post(
        `/firewall/nat/${id}/toggle`,
        { enable: isCurrentlyDisabled },
        {
            preserveScroll: true,
            onFinish: () => {
                actionInProgress.value = null;
            },
        }
    );
};

const deleteRule = (rule: FirewallNatRule) => {
    const id = rule['.id'];
    if (!id) return;

    if (confirm(`Delete NAT Rule [${rule.chain}] ${rule.action} (${rule.comment || id})?`)) {
        actionInProgress.value = id;
        router.delete(`/firewall/nat/${id}`, {
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
                    <ArrowRightLeft class="h-4 w-4 text-primary" />
                    <span>Firewall NAT Rules</span>
                    <Badge variant="secondary" class="text-xs">
                        {{ rules?.length || 0 }}
                    </Badge>
                </CardTitle>
                <p class="text-xs text-muted-foreground">
                    Network Address Translation: Internet sharing (masquerade), Port Forwarding (dst-nat), and SNAT.
                </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <!-- Chain Filter Pill -->
                <div class="flex items-center rounded-md border bg-muted/40 p-0.5 text-xs">
                    <button
                        type="button"
                        v-for="c in ['all', 'dstnat', 'srcnat']"
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
                        placeholder="Search NAT rules, port, IP..."
                        class="h-8 pl-8 text-xs"
                    />
                </div>

                <!-- Add Button -->
                <Button size="sm" class="h-8 gap-1 text-xs" @click="openAddModal">
                    <Plus class="h-3.5 w-3.5" />
                    <span>Add NAT Rule</span>
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
                            <th class="px-3 py-2.5">Incoming Match</th>
                            <th class="px-3 py-2.5">Translated Target</th>
                            <th class="px-3 py-2.5">Comment / Label</th>
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
                                    class="border font-mono text-[11px] font-bold"
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
                                    :class="
                                        rule.chain === 'dstnat'
                                            ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                                            : 'border-indigo-500/40 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10'
                                    "
                                >
                                    {{ rule.chain }}
                                </Badge>
                            </td>

                            <!-- Incoming Match Criteria -->
                            <td class="px-3 py-2.5">
                                <div class="space-y-0.5 font-mono text-[11px]">
                                    <!-- In / Out Interface -->
                                    <div v-if="rule['in-interface'] || rule['out-interface']" class="flex items-center gap-1">
                                        <span v-if="rule['in-interface']" class="text-sky-600 dark:text-sky-400 font-semibold">
                                            in: {{ rule['in-interface'] }}
                                        </span>
                                        <span v-if="rule['out-interface']" class="text-indigo-600 dark:text-indigo-400 font-semibold">
                                            out: {{ rule['out-interface'] }}
                                        </span>
                                    </div>

                                    <!-- Protocol & Port -->
                                    <div v-if="rule.protocol || rule['dst-port']" class="flex items-center gap-1.5">
                                        <span v-if="rule.protocol" class="font-bold text-foreground">{{ rule.protocol }}</span>
                                        <span v-if="rule['dst-port']" class="text-primary font-semibold">port: {{ rule['dst-port'] }}</span>
                                    </div>

                                    <!-- IP addresses -->
                                    <div v-if="rule['src-address'] || rule['dst-address']" class="text-[10px] text-muted-foreground">
                                        <span v-if="rule['src-address']">src: {{ rule['src-address'] }} </span>
                                        <span v-if="rule['dst-address']">dst: {{ rule['dst-address'] }}</span>
                                    </div>

                                    <!-- Catch all fallback -->
                                    <div v-if="!rule['in-interface'] && !rule['out-interface'] && !rule.protocol && !rule['dst-port'] && !rule['src-address'] && !rule['dst-address']" class="text-[10px] text-muted-foreground italic">
                                        (all traffic)
                                    </div>
                                </div>
                            </td>

                            <!-- Translated Target Details -->
                            <td class="px-3 py-2.5">
                                <div v-if="rule['to-addresses'] || rule['to-ports']" class="flex items-center gap-1.5 font-mono text-[11px]">
                                    <ArrowRight class="h-3 w-3 text-muted-foreground shrink-0" />
                                    <span v-if="rule['to-addresses']" class="font-bold text-emerald-600 dark:text-emerald-400">
                                        {{ rule['to-addresses'] }}
                                    </span>
                                    <span v-if="rule['to-ports']" class="text-primary font-bold">
                                        :{{ rule['to-ports'] }}
                                    </span>
                                </div>
                                <div v-else-if="rule.action === 'masquerade'" class="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Globe class="h-3 w-3 text-indigo-500 shrink-0" />
                                    <span class="text-[11px]">Router WAN IP</span>
                                </div>
                                <div v-else class="text-[10px] text-muted-foreground">-</div>
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
                                        title="Edit NAT Rule"
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
                                No firewall NAT rules found matching your criteria.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </CardContent>
    </Card>

    <!-- NAT Modal (Add / Edit) -->
    <FirewallNatModal
        v-model:open="isModalOpen"
        :rule-to-edit="editingRule"
        :interfaces="interfaces"
    />
</template>
