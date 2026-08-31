<script setup lang="ts">
import { ArrowDown, ArrowUp, Clock, Globe, Shield, User, Users, Wifi } from '@lucide/vue';
import { computed, ref } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { RouterHotspotUser, RouterPppUser } from '@/types/router';

const props = defineProps<{
    hotspotUsers: RouterHotspotUser[];
    pppUsers: RouterPppUser[];
}>();

const activeTab = ref<'hotspot' | 'pppoe'>('hotspot');
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

const filteredHotspot = computed(() => {
    if (!searchQuery.value.trim()) return props.hotspotUsers || [];
    const q = searchQuery.value.toLowerCase();
    return (props.hotspotUsers || []).filter(
        (u) =>
            u.user.toLowerCase().includes(q) ||
            u.address.toLowerCase().includes(q) ||
            (u['mac-address'] && u['mac-address'].toLowerCase().includes(q))
    );
});

const filteredPpp = computed(() => {
    if (!searchQuery.value.trim()) return props.pppUsers || [];
    const q = searchQuery.value.toLowerCase();
    return (props.pppUsers || []).filter(
        (u) =>
            u.name.toLowerCase().includes(q) ||
            (u.address && u.address.toLowerCase().includes(q)) ||
            (u['caller-id'] && u['caller-id'].toLowerCase().includes(q))
    );
});
</script>

<template>
    <Card class="border-border/80 bg-card/60 shadow-xs backdrop-blur">
        <CardHeader class="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle class="flex items-center gap-2 text-base font-bold">
                    <Users class="h-4 w-4 text-purple-500" />
                    <span>Active Client Sessions</span>
                </CardTitle>
                <p class="text-xs text-muted-foreground">
                    Real-time Hotspot vouchers & PPPoE tunnel clients.
                </p>
            </div>

            <div class="flex items-center gap-3">
                <div class="flex items-center rounded-lg border bg-muted/40 p-1">
                    <button
                        type="button"
                        @click="activeTab = 'hotspot'"
                        class="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
                        :class="activeTab === 'hotspot' ? 'bg-background text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'"
                    >
                        Hotspot ({{ hotspotUsers?.length || 0 }})
                    </button>
                    <button
                        type="button"
                        @click="activeTab = 'pppoe'"
                        class="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
                        :class="activeTab === 'pppoe' ? 'bg-background text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'"
                    >
                        PPPoE / PPP ({{ pppUsers?.length || 0 }})
                    </button>
                </div>
            </div>
        </CardHeader>

        <div v-if="activeTab === 'hotspot'">
            <CardContent class="p-0">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="border-b bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            <tr>
                                <th class="py-2.5 pl-4 pr-2">Username / Voucher</th>
                                <th class="px-3 py-2.5">IP Address</th>
                                <th class="px-3 py-2.5">MAC Address</th>
                                <th class="px-3 py-2.5">Uptime</th>
                                <th class="py-2.5 pl-3 pr-4 text-right">Data In / Out</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/60">
                            <tr
                                v-for="(u, idx) in filteredHotspot"
                                :key="idx"
                                class="transition-colors hover:bg-muted/30"
                            >
                                <td class="py-2.5 pl-4 pr-2">
                                    <div class="flex items-center gap-2">
                                        <Wifi class="h-3.5 w-3.5 text-purple-500 shrink-0" />
                                        <span class="font-bold text-foreground">{{ u.user }}</span>
                                    </div>
                                </td>

                                <td class="px-3 py-2.5 font-mono text-[11px] text-primary">
                                    {{ u.address }}
                                </td>

                                <td class="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                                    {{ u['mac-address'] || '-' }}
                                </td>

                                <td class="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                                    {{ u.uptime || '-' }}
                                </td>

                                <td class="py-2.5 pl-3 pr-4 text-right font-mono text-[11px]">
                                    <span class="text-emerald-600 dark:text-emerald-400">↓ {{ formatBytes(u['bytes-in']) }}</span>
                                    <span class="text-muted-foreground mx-1">/</span>
                                    <span class="text-blue-600 dark:text-blue-400">↑ {{ formatBytes(u['bytes-out']) }}</span>
                                </td>
                            </tr>

                            <tr v-if="filteredHotspot.length === 0">
                                <td colspan="5" class="py-6 text-center text-xs text-muted-foreground">
                                    No active Hotspot users currently connected.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </div>

        <div v-if="activeTab === 'pppoe'">
            <CardContent class="p-0">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="border-b bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            <tr>
                                <th class="py-2.5 pl-4 pr-2">Account Name</th>
                                <th class="px-3 py-2.5">Service</th>
                                <th class="px-3 py-2.5">Assigned IP</th>
                                <th class="px-3 py-2.5">Caller ID (MAC)</th>
                                <th class="py-2.5 pl-3 pr-4 text-right">Uptime</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/60">
                            <tr
                                v-for="(p, idx) in filteredPpp"
                                :key="idx"
                                class="transition-colors hover:bg-muted/30"
                            >
                                <td class="py-2.5 pl-4 pr-2">
                                    <div class="flex items-center gap-2">
                                        <Globe class="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                        <span class="font-bold text-foreground">{{ p.name }}</span>
                                    </div>
                                </td>

                                <td class="px-3 py-2.5">
                                    <Badge variant="outline" class="text-[10px] uppercase font-mono">
                                        {{ p.service || 'PPPoE' }}
                                    </Badge>
                                </td>

                                <td class="px-3 py-2.5 font-mono text-[11px] text-primary">
                                    {{ p.address || '-' }}
                                </td>

                                <td class="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                                    {{ p['caller-id'] || '-' }}
                                </td>

                                <td class="py-2.5 pl-3 pr-4 text-right font-mono text-[11px] text-muted-foreground">
                                    {{ p.uptime || '-' }}
                                </td>
                            </tr>

                            <tr v-if="filteredPpp.length === 0">
                                <td colspan="5" class="py-6 text-center text-xs text-muted-foreground">
                                    No active PPPoE tunnel clients.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </div>
    </Card>
</template>
