<script setup lang="ts">
import {
    Activity,
    ArrowDown,
    ArrowUp,
    CheckCircle2,
    EthernetPort,
    Network,
    Search,
    Shield,
    Wifi,
    XCircle,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { RouterInterface, RouterIpAddress } from '@/types/router';

const props = defineProps<{
    interfaces: RouterInterface[];
    ipAddresses?: RouterIpAddress[];
}>();

const searchQuery = ref('');

const formatBytes = (bytesStr?: string | number) => {
    if (!bytesStr) return '0 B';
    const bytes = typeof bytesStr === 'string' ? parseInt(bytesStr, 10) : bytesStr;
    if (isNaN(bytes) || bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

const getInterfaceIp = (ifaceName: string) => {
    if (!props.ipAddresses) return null;
    const match = props.ipAddresses.find((ip) => ip.interface === ifaceName);
    return match ? match.address : null;
};

const getInterfaceIcon = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('wlan') || t.includes('wifi')) return Wifi;
    if (t.includes('bridge')) return Network;
    return EthernetPort;
};

const filteredInterfaces = computed(() => {
    if (!searchQuery.value.trim()) return props.interfaces || [];
    const q = searchQuery.value.toLowerCase();
    return (props.interfaces || []).filter(
        (i) =>
            i.name.toLowerCase().includes(q) ||
            i.type.toLowerCase().includes(q) ||
            (i['mac-address'] && i['mac-address'].toLowerCase().includes(q)) ||
            (i.comment && i.comment.toLowerCase().includes(q))
    );
});
</script>

<template>
    <Card class="border-border/80 bg-card/60 shadow-xs backdrop-blur">
        <CardHeader class="flex flex-row items-center justify-between pb-3">
            <div>
                <CardTitle class="flex items-center gap-2 text-base font-bold">
                    <Activity class="h-4 w-4 text-primary" />
                    <span>Network Interfaces</span>
                    <Badge variant="secondary" class="text-xs">
                        {{ interfaces?.length || 0 }}
                    </Badge>
                </CardTitle>
                <p class="text-xs text-muted-foreground">
                    Real-time port status, MAC addresses, and RX/TX traffic.
                </p>
            </div>

            <div class="relative w-48 sm:w-64">
                <Search class="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                    v-model="searchQuery"
                    placeholder="Search interface..."
                    class="h-8 pl-8 text-xs"
                />
            </div>
        </CardHeader>

        <CardContent class="p-0">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="border-b bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <tr>
                            <th class="py-2.5 pl-4 pr-2">Interface</th>
                            <th class="px-3 py-2.5">Type</th>
                            <th class="px-3 py-2.5">Status</th>
                            <th class="px-3 py-2.5">IP Address</th>
                            <th class="px-3 py-2.5">MAC Address</th>
                            <th class="px-3 py-2.5 text-right">Rx Traffic</th>
                            <th class="py-2.5 pl-3 pr-4 text-right">Tx Traffic</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/60">
                        <tr
                            v-for="iface in filteredInterfaces"
                            :key="iface.name"
                            class="transition-colors hover:bg-muted/30"
                        >
                            <td class="py-2.5 pl-4 pr-2">
                                <div class="flex items-center gap-2">
                                    <component
                                        :is="getInterfaceIcon(iface.type)"
                                        class="h-4 w-4 text-muted-foreground shrink-0"
                                    />
                                    <div class="flex flex-col">
                                        <span class="font-bold text-foreground">{{ iface.name }}</span>
                                        <span
                                            v-if="iface.comment"
                                            class="text-[10px] text-muted-foreground"
                                        >
                                            {{ iface.comment }}
                                        </span>
                                    </div>
                                </div>
                            </td>

                            <td class="px-3 py-2.5">
                                <Badge variant="outline" class="font-mono text-[10px] uppercase">
                                    {{ iface.type }}
                                </Badge>
                            </td>

                            <td class="px-3 py-2.5">
                                <div class="flex items-center gap-1.5">
                                    <span
                                        class="h-2 w-2 rounded-full"
                                        :class="
                                            iface.running === 'true' || iface.running === true
                                                ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50'
                                                : 'bg-muted-foreground/40'
                                        "
                                    />
                                    <span
                                        class="text-[11px] font-medium"
                                        :class="
                                            iface.running === 'true' || iface.running === true
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-muted-foreground'
                                        "
                                    >
                                        {{
                                            iface.running === 'true' || iface.running === true
                                                ? 'Running (Up)'
                                                : 'Down / Idle'
                                        }}
                                    </span>
                                </div>
                            </td>

                            <td class="px-3 py-2.5">
                                <span
                                    v-if="getInterfaceIp(iface.name)"
                                    class="font-mono text-[11px] font-semibold text-primary"
                                >
                                    {{ getInterfaceIp(iface.name) }}
                                </span>
                                <span v-else class="text-muted-foreground text-[10px]">-</span>
                            </td>

                            <td class="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                                {{ iface['mac-address'] || '-' }}
                            </td>

                            <td class="px-3 py-2.5 text-right font-mono text-[11px]">
                                <div class="flex items-center justify-end gap-1 text-emerald-600 dark:text-emerald-400">
                                    <ArrowDown class="h-3 w-3" />
                                    <span>{{ formatBytes(iface['rx-byte']) }}</span>
                                </div>
                            </td>

                            <td class="py-2.5 pl-3 pr-4 text-right font-mono text-[11px]">
                                <div class="flex items-center justify-end gap-1 text-blue-600 dark:text-blue-400">
                                    <ArrowUp class="h-3 w-3" />
                                    <span>{{ formatBytes(iface['tx-byte']) }}</span>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="filteredInterfaces.length === 0">
                            <td colspan="7" class="py-6 text-center text-xs text-muted-foreground">
                                No network interfaces found.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </CardContent>
    </Card>
</template>
