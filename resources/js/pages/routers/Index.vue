<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import {
    Activity,
    AlertCircle,
    CheckCircle2,
    Clock,
    Edit,
    Layers,
    Loader2,
    Play,
    Plus,
    Router as RouterIcon,
    Server,
    Shield,
    Trash2,
    Zap,
} from '@lucide/vue';
import { ref } from 'vue';
import RouterConnectModal from '@/components/router/RouterConnectModal.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout.vue';
import type { Router } from '@/types/router';

defineOptions({
    layout: AppLayout,
});

const props = defineProps<{
    routers: Router[];
}>();

const showAddModal = ref(false);
const connectingId = ref<number | null>(null);
const testingId = ref<number | null>(null);
const testResults = ref<Record<number, any>>({});

const handleConnect = (r: Router) => {
    connectingId.value = r.id;
    router.post(`/routers/${r.id}/connect`, {}, {
        onFinish: () => {
            connectingId.value = null;
        },
    });
};

const handleTest = async (r: Router) => {
    testingId.value = r.id;
    try {
        const res = await fetch('/routers/test-connection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN':
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
                Accept: 'application/json',
            },
            body: JSON.stringify({ router_id: r.id }),
        });
        const data = await res.json();
        testResults.value[r.id] = data;
    } catch (e: any) {
        testResults.value[r.id] = { success: false, message: e.message };
    } finally {
        testingId.value = null;
    }
};

const handleDelete = (r: Router) => {
    if (confirm(`Are you sure you want to delete profile "${r.name}"?`)) {
        router.delete(`/routers/${r.id}`);
    }
};
</script>

<template>
    <Head title="Manage Routers" />

    <div class="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold tracking-tight">MikroTik Router Profiles</h1>
                <p class="text-xs text-muted-foreground">
                    Manage and switch between your saved MikroTik routers and session credentials.
                </p>
            </div>

            <Button @click="showAddModal = true" class="gap-2 shrink-0">
                <Plus class="h-4 w-4" />
                <span>Add Router Profile</span>
            </Button>
        </div>

        <!-- Routers Grid -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card
                v-for="r in routers"
                :key="r.id"
                class="relative overflow-hidden border-border/80 bg-card/60 shadow-xs backdrop-blur transition-all hover:shadow-md"
                :class="{ 'ring-2 ring-primary/40 border-primary/50': r.is_active }"
            >
                <CardHeader class="pb-3">
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex items-center gap-3">
                            <div
                                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                            >
                                <RouterIcon class="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle class="text-base font-bold">{{ r.name }}</CardTitle>
                                <CardDescription class="font-mono text-xs">
                                    {{ r.host }}:{{ r.port }}
                                </CardDescription>
                            </div>
                        </div>

                        <Badge
                            v-if="r.is_active"
                            class="h-5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold"
                        >
                            Active
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent class="space-y-3 pb-3 text-xs">
                    <div class="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-2.5">
                        <div>
                            <span class="text-muted-foreground text-[10px]">Username:</span>
                            <div class="font-semibold">{{ r.username }}</div>
                        </div>
                        <div>
                            <span class="text-muted-foreground text-[10px]">Security:</span>
                            <div class="font-semibold flex items-center gap-1">
                                <Shield class="h-3 w-3 text-emerald-500" v-if="r.use_ssl" />
                                <span>{{ r.use_ssl ? 'API-SSL (8729)' : 'Plain API (8728)' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span class="flex items-center gap-1">
                            <Clock class="h-3 w-3" />
                            <span>{{ r.last_connected_at ? `Seen ${r.last_connected_at}` : 'Never connected' }}</span>
                        </span>
                    </div>

                    <!-- Test Result Box -->
                    <div
                        v-if="testResults[r.id]"
                        class="rounded-md p-2 text-[11px]"
                        :class="testResults[r.id].success ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-destructive/10 text-destructive'"
                    >
                        <div class="flex items-center justify-between">
                            <span>{{ testResults[r.id].message }}</span>
                            <span v-if="testResults[r.id].latency_ms" class="font-bold">
                                {{ testResults[r.id].latency_ms }}ms
                            </span>
                        </div>
                    </div>

                    <div class="flex items-center justify-between gap-2 pt-2 border-t">
                        <div class="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                @click="handleTest(r)"
                                :disabled="testingId === r.id"
                                class="h-8 px-2.5 text-xs"
                                title="Test router ping & authentication"
                            >
                                <Loader2 v-if="testingId === r.id" class="h-3 w-3 animate-spin" />
                                <Activity v-else class="h-3 w-3 text-primary mr-1" />
                                <span>Test</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                @click="handleDelete(r)"
                                class="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                                title="Delete profile"
                            >
                                <Trash2 class="h-3.5 w-3.5" />
                            </Button>
                        </div>

                        <Button
                            size="sm"
                            :variant="r.is_active ? 'secondary' : 'default'"
                            @click="handleConnect(r)"
                            :disabled="connectingId === r.id"
                            class="h-8 gap-1.5 text-xs font-semibold"
                        >
                            <Loader2 v-if="connectingId === r.id" class="h-3.5 w-3.5 animate-spin" />
                            <Play v-else class="h-3.5 w-3.5 fill-current" />
                            <span>{{ r.is_active ? 'Open Dashboard' : 'Connect' }}</span>   
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div
            v-if="routers.length === 0"
            class="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center"
        >
            <Server class="h-12 w-12 text-muted-foreground/40 mb-3" />
            <h3 class="text-base font-bold">No MikroTik Routers Configured</h3>
            <p class="mt-1 max-w-sm text-xs text-muted-foreground">
                Add your first router credentials to connect to RouterOS and begin monitoring live network stats.
            </p>
            <Button @click="showAddModal = true" class="mt-4 gap-2">
                <Plus class="h-4 w-4" />
                <span>Add First Router</span>
            </Button>
        </div>

        <RouterConnectModal
            v-model:open="showAddModal"
            :show-trigger="false"
        />
    </div>
</template>
