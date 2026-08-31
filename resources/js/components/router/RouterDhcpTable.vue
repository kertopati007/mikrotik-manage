<script setup lang="ts">
import { Laptop, Network, Search, Smartphone, Users } from '@lucide/vue';
import { computed, ref } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { RouterDhcpLease } from '@/types/router';

const props = defineProps<{
    leases: RouterDhcpLease[];
}>();

const searchQuery = ref('');

const filteredLeases = computed(() => {
    if (!searchQuery.value.trim()) return props.leases || [];
    const q = searchQuery.value.toLowerCase();
    return (props.leases || []).filter(
        (l) =>
            l.address.toLowerCase().includes(q) ||
            l['mac-address'].toLowerCase().includes(q) ||
            (l['host-name'] && l['host-name'].toLowerCase().includes(q)) ||
            (l.status && l.status.toLowerCase().includes(q))
    );
});
</script>

<template>
    <Card class="border-border/80 bg-card/60 shadow-xs backdrop-blur">
        <CardHeader class="flex flex-row items-center justify-between pb-3">
            <div>
                <CardTitle class="flex items-center gap-2 text-base font-bold">
                    <Network class="h-4 w-4 text-emerald-500" />
                    <span>DHCP Server Leases</span>
                    <Badge variant="secondary" class="text-xs">
                        {{ leases?.length || 0 }} Active
                    </Badge>
                </CardTitle>
                <p class="text-xs text-muted-foreground">
                    Connected client devices, IP leases, and hostnames.
                </p>
            </div>

            <div class="relative w-48 sm:w-64">
                <Search class="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                    v-model="searchQuery"
                    placeholder="Search IP / Hostname..."
                    class="h-8 pl-8 text-xs"
                />
            </div>
        </CardHeader>

        <CardContent class="p-0">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="border-b bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <tr>
                            <th class="py-2.5 pl-4 pr-2">IP Address</th>
                            <th class="px-3 py-2.5">Hostname</th>
                            <th class="px-3 py-2.5">MAC Address</th>
                            <th class="px-3 py-2.5">Status</th>
                            <th class="py-2.5 pl-3 pr-4 text-right">Expires In</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/60">
                        <tr
                            v-for="(lease, idx) in filteredLeases"
                            :key="idx"
                            class="transition-colors hover:bg-muted/30"
                        >
                            <td class="py-2.5 pl-4 pr-2">
                                <div class="flex items-center gap-2">
                                    <Laptop class="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                    <span class="font-mono font-bold text-foreground">{{ lease.address }}</span>
                                </div>
                            </td>

                            <td class="px-3 py-2.5">
                                <span class="font-medium text-foreground">
                                    {{ lease['host-name'] || 'Unknown Device' }}
                                </span>
                            </td>

                            <td class="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                                {{ lease['mac-address'] }}
                            </td>

                            <td class="px-3 py-2.5">
                                <Badge
                                    variant="outline"
                                    class="text-[10px] capitalize"
                                    :class="
                                        lease.status === 'bound'
                                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                            : 'border-muted'
                                    "
                                >
                                    {{ lease.status || 'Active' }}
                                </Badge>
                            </td>

                            <td class="py-2.5 pl-3 pr-4 text-right font-mono text-[11px] text-muted-foreground">
                                {{ lease['expires-after'] || 'Static / Active' }}
                            </td>
                        </tr>

                        <tr v-if="filteredLeases.length === 0">
                            <td colspan="5" class="py-6 text-center text-xs text-muted-foreground">
                                No DHCP leases found on this router.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </CardContent>
    </Card>
</template>
