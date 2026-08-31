<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import {
    Activity,
    Clock,
    Globe,
    KeyRound,
    Loader2,
    LogOut,
    Network,
    RefreshCw,
    Search,
    Shield,
    UserCheck,
    Wifi,
    X,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { PPPActive } from '@/types/router';

const props = defineProps<{
    activeUsers: PPPActive[];
}>();

const searchQuery = ref('');
const selectedService = ref<string>('all');
const actionInProgress = ref<string | null>(null);

const filteredUsers = computed(() => {
    return props.activeUsers.filter((user) => {
        const matchesSearch =
            !searchQuery.value ||
            user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            (user.address && user.address.includes(searchQuery.value)) ||
            (user['caller-id'] && user['caller-id'].toLowerCase().includes(searchQuery.value.toLowerCase()));

        const matchesService =
            selectedService.value === 'all' ||
            (user.service || '').toLowerCase() === selectedService.value.toLowerCase();

        return matchesSearch && matchesService;
    });
});

const getServiceBadgeClass = (service?: string) => {
    const s = (service || '').toLowerCase();
    if (s === 'pppoe') return 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30';
    if (s === 'l2tp') return 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
    if (s === 'pptp') return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    if (s === 'sstp') return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    if (s === 'ovpn') return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
    return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
};

const handleDisconnect = (user: PPPActive) => {
    const userId = user['.id'] || user.name;
    if (!confirm(`Are you sure you want to disconnect/kick session "${user.name}"?`)) {
        return;
    }

    actionInProgress.value = userId;

    router.delete(`/ppp/active/${encodeURIComponent(userId)}`, {
        preserveScroll: true,
        onFinish: () => {
            actionInProgress.value = null;
        },
    });
};
</script>

<template>
    <Card class="border-border/80 bg-card/60 shadow-xs backdrop-blur">
        <CardHeader class="pb-3">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle class="flex items-center gap-2 text-base font-bold">
                    <UserCheck class="h-4 w-4 text-emerald-500" />
                    <span>PPP Active Sessions</span>
                    <Badge variant="secondary" class="font-mono text-xs">
                        {{ filteredUsers.length }} active
                    </Badge>
                </CardTitle>

                <!-- Search & Filters -->
                <div class="flex flex-wrap items-center gap-2">
                    <div class="relative w-full sm:w-56">
                        <Search class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search active user / IP..."
                            class="h-8 pl-8 text-xs"
                        />
                        <button
                            v-if="searchQuery"
                            @click="searchQuery = ''"
                            class="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                        >
                            <X class="h-3 w-3" />
                        </button>
                    </div>

                    <select
                        v-model="selectedService"
                        class="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                    >
                        <option value="all">All Services</option>
                        <option value="pppoe">PPPoE</option>
                        <option value="l2tp">L2TP</option>
                        <option value="pptp">PPTP</option>
                        <option value="sstp">SSTP</option>
                        <option value="ovpn">OpenVPN</option>
                    </select>
                </div>
            </div>
        </CardHeader>

        <CardContent class="p-0">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="border-b bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <tr>
                            <th class="py-2.5 pl-4 pr-3">User / Name</th>
                            <th class="px-3 py-2.5">Service</th>
                            <th class="px-3 py-2.5">IP Address</th>
                            <th class="px-3 py-2.5">Caller ID / MAC</th>
                            <th class="px-3 py-2.5">Uptime</th>
                            <th class="px-3 py-2.5">Encoding</th>
                            <th class="py-2.5 pl-3 pr-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/60">
                        <tr v-if="filteredUsers.length === 0">
                            <td colspan="7" class="py-8 text-center text-muted-foreground">
                                <div class="flex flex-col items-center justify-center gap-2">
                                    <Wifi class="h-8 w-8 text-muted-foreground/40" />
                                    <p class="text-xs font-medium">No active PPP sessions found</p>
                                </div>
                            </td>
                        </tr>

                        <tr
                            v-for="user in filteredUsers"
                            :key="user['.id'] || user.name"
                            class="hover:bg-muted/30 transition-colors"
                        >
                            <!-- Username -->
                            <td class="py-2.5 pl-4 pr-3 font-medium text-foreground">
                                <div class="flex items-center gap-2">
                                    <div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span class="font-semibold">{{ user.name }}</span>
                                    <Badge
                                        v-if="user.radius === 'true' || user.radius === true"
                                        variant="outline"
                                        class="h-4 px-1 text-[9px] border-amber-500/40 text-amber-600 dark:text-amber-400"
                                    >
                                        RADIUS
                                    </Badge>
                                </div>
                            </td>

                            <!-- Service -->
                            <td class="px-3 py-2.5">
                                <Badge variant="outline" :class="getServiceBadgeClass(user.service)" class="uppercase font-mono text-[10px]">
                                    {{ user.service || 'any' }}
                                </Badge>
                            </td>

                            <!-- IP Address -->
                            <td class="px-3 py-2.5 font-mono font-semibold text-primary">
                                {{ user.address || '-' }}
                            </td>

                            <!-- Caller ID -->
                            <td class="px-3 py-2.5 font-mono text-muted-foreground">
                                {{ user['caller-id'] || '-' }}
                            </td>

                            <!-- Uptime -->
                            <td class="px-3 py-2.5 font-mono text-muted-foreground">
                                <div class="flex items-center gap-1.5">
                                    <Clock class="h-3.5 w-3.5 text-muted-foreground/60" />
                                    <span>{{ user.uptime || '-' }}</span>
                                </div>
                            </td>

                            <!-- Encoding -->
                            <td class="px-3 py-2.5 text-[11px] text-muted-foreground">
                                {{ user.encoding || '-' }}
                            </td>

                            <!-- Actions -->
                            <td class="py-2.5 pl-3 pr-4 text-right">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    class="h-7 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-300"
                                    :disabled="actionInProgress === (user['.id'] || user.name)"
                                    @click="handleDisconnect(user)"
                                >
                                    <Loader2
                                        v-if="actionInProgress === (user['.id'] || user.name)"
                                        class="mr-1 h-3 w-3 animate-spin"
                                    />
                                    <LogOut v-else class="mr-1 h-3 w-3" />
                                    <span>Kick</span>
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </CardContent>
    </Card>
</template>
