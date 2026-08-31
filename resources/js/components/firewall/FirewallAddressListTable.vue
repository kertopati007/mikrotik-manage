<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import {
    Clock,
    Edit2,
    ListFilter,
    Loader2,
    Network,
    Plus,
    Power,
    Search,
    Shield,
    Trash2,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import FirewallAddressModal from '@/components/firewall/FirewallAddressModal.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { FirewallAddressList } from '@/types/router';

const props = defineProps<{
    addressLists: FirewallAddressList[];
}>();

const searchQuery = ref('');
const selectedListName = ref<string>('all');
const isModalOpen = ref(false);
const editingEntry = ref<FirewallAddressList | null>(null);
const actionInProgress = ref<string | null>(null);

const uniqueListNames = computed(() => {
    return Array.from(new Set((props.addressLists || []).map((a) => a.list))).filter(Boolean);
});

const getListBadgeColor = (name: string) => {
    const n = (name || '').toLowerCase();
    if (n.includes('block') || n.includes('black') || n.includes('drop') || n.includes('scan')) {
        return 'border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-500/10';
    }
    if (n.includes('white') || n.includes('allow') || n.includes('admin') || n.includes('vip')) {
        return 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10';
    }
    if (n.includes('local') || n.includes('lan')) {
        return 'border-sky-500/40 text-sky-600 dark:text-sky-400 bg-sky-500/10';
    }
    return 'border-indigo-500/40 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10';
};

const filteredEntries = computed(() => {
    let list = props.addressLists || [];

    if (selectedListName.value !== 'all') {
        list = list.filter((a) => a.list === selectedListName.value);
    }

    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase();
        list = list.filter((a) =>
            (a.list && a.list.toLowerCase().includes(q)) ||
            (a.address && a.address.toLowerCase().includes(q)) ||
            (a.comment && a.comment.toLowerCase().includes(q))
        );
    }

    return list;
});

const openAddModal = () => {
    editingEntry.value = null;
    isModalOpen.value = true;
};

const openEditModal = (entry: FirewallAddressList) => {
    editingEntry.value = entry;
    isModalOpen.value = true;
};

const toggleEntry = (entry: FirewallAddressList) => {
    const id = entry['.id'];
    if (!id) return;

    const isCurrentlyDisabled = entry.disabled === 'true' || entry.disabled === true;
    actionInProgress.value = id;

    router.post(
        `/firewall/address-list/${id}/toggle`,
        { enable: isCurrentlyDisabled },
        {
            preserveScroll: true,
            onFinish: () => {
                actionInProgress.value = null;
            },
        }
    );
};

const deleteEntry = (entry: FirewallAddressList) => {
    const id = entry['.id'];
    if (!id) return;

    if (confirm(`Remove address ${entry.address} from list "${entry.list}"?`)) {
        actionInProgress.value = id;
        router.delete(`/firewall/address-list/${id}`, {
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
                    <ListFilter class="h-4 w-4 text-primary" />
                    <span>Firewall Address Lists</span>
                    <Badge variant="secondary" class="text-xs">
                        {{ addressLists?.length || 0 }}
                    </Badge>
                </CardTitle>
                <p class="text-xs text-muted-foreground">
                    Named collections of IP addresses, subnets, and hostnames for dynamic firewall rule matching.
                </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <!-- List Name Filter -->
                <select
                    v-model="selectedListName"
                    class="h-8 rounded-md border border-input bg-background px-2.5 text-xs shadow-xs"
                >
                    <option value="all">All Lists ({{ addressLists?.length || 0 }})</option>
                    <option
                        v-for="name in uniqueListNames"
                        :key="name"
                        :value="name"
                    >
                        {{ name }} ({{ addressLists.filter(a => a.list === name).length }})
                    </option>
                </select>

                <!-- Search Input -->
                <div class="relative w-40 sm:w-56">
                    <Search class="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        v-model="searchQuery"
                        placeholder="Search IP, list, comment..."
                        class="h-8 pl-8 text-xs"
                    />
                </div>

                <!-- Add Button -->
                <Button size="sm" class="h-8 gap-1 text-xs" @click="openAddModal">
                    <Plus class="h-3.5 w-3.5" />
                    <span>Add IP to List</span>
                </Button>
            </div>
        </CardHeader>

        <CardContent class="p-0">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="border-b bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <tr>
                            <th class="py-2.5 pl-4 pr-2 w-12 text-center">Flags</th>
                            <th class="px-3 py-2.5">List Name</th>
                            <th class="px-3 py-2.5">IP Address / Subnet</th>
                            <th class="px-3 py-2.5">Timeout / Status</th>
                            <th class="px-3 py-2.5">Created At</th>
                            <th class="px-3 py-2.5">Comment / Note</th>
                            <th class="py-2.5 pl-3 pr-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/60">
                        <tr
                            v-for="(entry, idx) in filteredEntries"
                            :key="entry['.id'] || idx"
                            class="transition-colors hover:bg-muted/30"
                            :class="{
                                'opacity-50 bg-muted/20': entry.disabled === 'true' || entry.disabled === true,
                            }"
                        >
                            <!-- Flags Column (X, D) -->
                            <td class="py-2.5 pl-4 pr-2 text-center">
                                <div class="flex items-center justify-center gap-1 font-mono text-[11px] font-bold">
                                    <span
                                        v-if="entry.disabled === 'true' || entry.disabled === true"
                                        class="text-rose-500"
                                        title="Disabled"
                                    >X</span>
                                    <span
                                        v-if="entry.dynamic === 'true' || entry.dynamic === true"
                                        class="text-sky-500"
                                        title="Dynamic"
                                    >D</span>
                                    <span
                                        v-if="
                                            (entry.disabled !== 'true' && entry.disabled !== true) &&
                                            (entry.dynamic !== 'true' && entry.dynamic !== true)
                                        "
                                        class="text-muted-foreground/30 font-mono text-[10px]"
                                    >
                                        {{ idx }}
                                    </span>
                                </div>
                            </td>

                            <!-- List Name -->
                            <td class="px-3 py-2.5 font-medium">
                                <Badge
                                    variant="outline"
                                    class="border font-mono text-[11px] font-bold"
                                    :class="getListBadgeColor(entry.list)"
                                >
                                    {{ entry.list }}
                                </Badge>
                            </td>

                            <!-- IP Address / Subnet -->
                            <td class="px-3 py-2.5">
                                <div class="flex items-center gap-1.5 font-mono text-[12px] font-semibold text-foreground">
                                    <Network class="h-3.5 w-3.5 text-primary shrink-0" />
                                    <span>{{ entry.address }}</span>
                                </div>
                            </td>

                            <!-- Timeout -->
                            <td class="px-3 py-2.5">
                                <div v-if="entry.timeout" class="flex items-center gap-1 font-mono text-[11px] text-amber-600 dark:text-amber-400">
                                    <Clock class="h-3 w-3" />
                                    <span>{{ entry.timeout }}</span>
                                </div>
                                <span v-else class="text-[10px] text-muted-foreground">Permanent</span>
                            </td>

                            <!-- Creation Time -->
                            <td class="px-3 py-2.5 font-mono text-[10px] text-muted-foreground">
                                {{ entry['creation-time'] || '-' }}
                            </td>

                            <!-- Comment -->
                            <td class="px-3 py-2.5">
                                <span v-if="entry.comment" class="text-[11px] text-foreground/90 font-medium">
                                    {{ entry.comment }}
                                </span>
                                <span v-else class="text-[10px] text-muted-foreground">-</span>
                            </td>

                            <!-- Actions -->
                            <td class="py-2.5 pl-3 pr-4 text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <!-- Enable / Disable Toggle -->
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="h-7 w-7 text-muted-foreground hover:text-foreground"
                                        :title="entry.disabled === 'true' || entry.disabled === true ? 'Enable Entry' : 'Disable Entry'"
                                        @click="toggleEntry(entry)"
                                        :disabled="actionInProgress === entry['.id']"
                                    >
                                        <Loader2 v-if="actionInProgress === entry['.id']" class="h-3.5 w-3.5 animate-spin" />
                                        <Power
                                            v-else
                                            class="h-3.5 w-3.5"
                                            :class="entry.disabled === 'true' || entry.disabled === true ? 'text-muted-foreground' : 'text-emerald-500'"
                                        />
                                    </Button>

                                    <!-- Edit Button -->
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="h-7 w-7 text-muted-foreground hover:text-foreground"
                                        title="Edit Entry"
                                        @click="openEditModal(entry)"
                                    >
                                        <Edit2 class="h-3.5 w-3.5" />
                                    </Button>

                                    <!-- Delete Button -->
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="h-7 w-7 text-rose-500/80 hover:bg-rose-500/10 hover:text-rose-600"
                                        title="Remove Entry"
                                        @click="deleteEntry(entry)"
                                        :disabled="actionInProgress === entry['.id']"
                                    >
                                        <Trash2 class="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="filteredEntries.length === 0">
                            <td colspan="7" class="py-8 text-center text-xs text-muted-foreground">
                                No address list entries found.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </CardContent>
    </Card>

    <!-- Address Modal (Add / Edit) -->
    <FirewallAddressModal
        v-model:open="isModalOpen"
        :entry-to-edit="editingEntry"
        :existing-lists="uniqueListNames"
    />
</template>
