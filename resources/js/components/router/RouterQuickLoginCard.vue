<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import {
    Activity,
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Clock,
    Eye,
    EyeOff,
    Globe,
    Key,
    Layers,
    Loader2,
    Lock,
    Play,
    Plus,
    Router as RouterIcon,
    Server,
    Shield,
    Sparkles,
    Trash2,
    User,
    Wifi,
    Zap,
} from '@lucide/vue';
import { ref } from 'vue';
import RouterConnectModal from '@/components/router/RouterConnectModal.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Router } from '@/types/router';

const props = defineProps<{
    savedRouters: Router[];
}>();

const showPassword = ref(false);
const isTesting = ref(false);
const isConnecting = ref(false);
const connectingRouterId = ref<number | null>(null);
const showAddModal = ref(false);

const form = ref({
    name: 'MikroTik Router',
    host: '192.168.88.1',
    port: 8728,
    username: 'admin',
    password: '',
    use_ssl: false,
    save: true,
});

const testResult = ref<{
    success: boolean;
    message: string;
    latency_ms?: number;
    identity?: string;
    version?: string;
} | null>(null);

const onSslToggle = (checked: boolean) => {
    form.value.use_ssl = checked;
    if (checked && form.value.port === 8728) {
        form.value.port = 8729;
    } else if (!checked && form.value.port === 8729) {
        form.value.port = 8728;
    }
};

const handleTestConnection = async () => {
    isTesting.value = true;
    testResult.value = null;

    try {
        const response = await fetch('/routers/test-connection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN':
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                host: form.value.host,
                port: form.value.port,
                username: form.value.username,
                password: form.value.password,
                use_ssl: form.value.use_ssl,
            }),
        });

        const data = await response.json();
        testResult.value = data;
    } catch (err: any) {
        testResult.value = {
            success: false,
            message: err?.message || 'Network test request failed',
        };
    } finally {
        isTesting.value = false;
    }
};

const handleQuickConnect = () => {
    isConnecting.value = true;
    router.post('/routers/quick-connect', form.value, {
        onFinish: () => {
            isConnecting.value = false;
        },
    });
};

const handleConnectSaved = (r: Router) => {
    connectingRouterId.value = r.id;
    router.post(`/routers/${r.id}/connect`, {}, {
        onFinish: () => {
            connectingRouterId.value = null;
        },
    });
};

const handleLaunchDemo = () => {
    form.value = {
        name: 'Demo Core Router (RB750Gr3)',
        host: 'demo.mikrotik.com',
        port: 8728,
        username: 'admin',
        password: '',
        use_ssl: false,
        save: true,
    };
    handleQuickConnect();
};
</script>

<template>
    <div class="mx-auto max-w-5xl space-y-8 py-6">
        <!-- Hero Title -->
        <div class="text-center space-y-3">
            <div class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles class="h-3.5 w-3.5" />
                <span>MikroTik RouterOS Session Manager</span>
            </div>
            <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Login to Router Dashboard
            </h1>
            <p class="mx-auto max-w-xl text-sm text-muted-foreground">
                Connect directly to your MikroTik RouterOS device via API (Port 8728 / 8729) or manage multiple router profiles with seamless live monitoring.
            </p>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <!-- Left 7 cols: Quick Connect / Router Login Form -->
            <Card class="lg:col-span-7 border-border/80 bg-card/60 shadow-md backdrop-blur">
                <CardHeader class="pb-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2.5">
                            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <RouterIcon class="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle class="text-base font-bold">Router Login</CardTitle>
                                <CardDescription class="text-xs">
                                    Authenticate with RouterOS to launch dashboard session
                                </CardDescription>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            @click="handleLaunchDemo"
                            class="h-8 gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/10"
                        >
                            <Sparkles class="h-3.5 w-3.5" />
                            <span>1-Click Demo</span>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent class="space-y-4">
                    <form @submit.prevent="handleQuickConnect" class="space-y-4">
                        <div class="grid grid-cols-2 gap-3">
                            <div class="col-span-2 space-y-1.5">
                                <Label for="login-name" class="text-xs font-semibold">Router Name / Label</Label>
                                <Input
                                    id="login-name"
                                    v-model="form.name"
                                    placeholder="e.g. Gateway Mikrotik RB750"
                                    required
                                    class="h-9 text-sm"
                                />
                            </div>

                            <div class="space-y-1.5">
                                <Label for="login-host" class="text-xs font-semibold">Router IP / Host</Label>
                                <Input
                                    id="login-host"
                                    v-model="form.host"
                                    placeholder="192.168.88.1"
                                    required
                                    class="h-9 text-sm font-mono"
                                />
                            </div>

                            <div class="space-y-1.5">
                                <Label for="login-port" class="text-xs font-semibold">API Port</Label>
                                <Input
                                    id="login-port"
                                    type="number"
                                    v-model.number="form.port"
                                    placeholder="8728"
                                    required
                                    class="h-9 text-sm font-mono"
                                />
                            </div>

                            <div class="space-y-1.5">
                                <Label for="login-user" class="text-xs font-semibold">Username</Label>
                                <Input
                                    id="login-user"
                                    v-model="form.username"
                                    placeholder="admin"
                                    required
                                    class="h-9 text-sm"
                                />
                            </div>

                            <div class="space-y-1.5">
                                <Label for="login-pass" class="text-xs font-semibold">Password</Label>
                                <div class="relative">
                                    <Input
                                        id="login-pass"
                                        :type="showPassword ? 'text' : 'password'"
                                        v-model="form.password"
                                        placeholder="Router password"
                                        class="h-9 pr-9 text-sm"
                                    />
                                    <button
                                        type="button"
                                        @click="showPassword = !showPassword"
                                        class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <Eye v-if="!showPassword" class="h-4 w-4" />
                                        <EyeOff v-else class="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between rounded-lg border bg-muted/40 p-2.5">
                            <div class="flex items-center space-x-2">
                                <Checkbox
                                    id="login-ssl"
                                    :checked="form.use_ssl"
                                    @update:checked="onSslToggle"
                                />
                                <Label for="login-ssl" class="cursor-pointer text-xs font-medium">
                                    Use SSL / API-SSL (Port 8729)
                                </Label>
                            </div>
                            <div class="flex items-center space-x-2">
                                <Checkbox
                                    id="login-save"
                                    :checked="form.save"
                                    @update:checked="form.save = $event"
                                />
                                <Label for="login-save" class="cursor-pointer text-xs font-medium text-muted-foreground">
                                    Save to Router List
                                </Label>
                            </div>
                        </div>

                        <!-- Test Connection Feedback Banner -->
                        <div
                            v-if="testResult"
                            class="rounded-lg border p-3 text-xs transition-all"
                            :class="
                                testResult.success
                                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                    : 'border-destructive/30 bg-destructive/10 text-destructive'
                            "
                        >
                            <div class="flex items-start gap-2">
                                <CheckCircle2
                                    v-if="testResult.success"
                                    class="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                                />
                                <AlertCircle v-else class="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                                <div class="flex-1 space-y-1">
                                    <div class="flex items-center justify-between font-semibold">
                                        <span>{{
                                            testResult.success
                                                ? 'Connection Verified'
                                                : 'Connection Failed'
                                        }}</span>
                                        <Badge
                                            v-if="testResult.latency_ms !== undefined"
                                            variant="outline"
                                            class="h-5 gap-1 bg-emerald-500/20 text-[10px]"
                                        >
                                            <Zap class="h-3 w-3" />
                                            {{ testResult.latency_ms }} ms
                                        </Badge>
                                    </div>
                                    <p class="text-[11px] opacity-90">{{ testResult.message }}</p>
                                    <div
                                        v-if="testResult.identity || testResult.version"
                                        class="flex flex-wrap gap-2 pt-1 font-mono text-[10px]"
                                    >
                                        <span v-if="testResult.identity"
                                            >Identity: <b>{{ testResult.identity }}</b></span
                                        >
                                        <span v-if="testResult.version"
                                            >RouterOS: <b>{{ testResult.version }}</b></span
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                @click="handleTestConnection"
                                :disabled="isTesting || isConnecting"
                                class="gap-1.5 text-xs"
                            >
                                <Loader2 v-if="isTesting" class="h-3.5 w-3.5 animate-spin" />
                                <Activity v-else class="h-3.5 w-3.5 text-primary" />
                                <span>{{ isTesting ? 'Testing Ping...' : 'Test Connection' }}</span>
                            </Button>

                            <Button
                                type="submit"
                                size="sm"
                                :disabled="isConnecting"
                                class="gap-1.5 px-5 font-semibold"
                            >
                                <Loader2 v-if="isConnecting" class="h-3.5 w-3.5 animate-spin" />
                                <Server v-else class="h-3.5 w-3.5" />
                                <span>Connect & Enter Dashboard</span>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <!-- Right 5 cols: Multi-Router Saved Sessions & Tips -->
            <div class="lg:col-span-5 space-y-4">
                <!-- Saved Routers Card -->
                <Card class="border-border/80 bg-card/60 shadow-md backdrop-blur">
                    <CardHeader class="pb-3">
                        <div class="flex items-center justify-between">
                            <CardTitle class="text-sm font-bold flex items-center gap-2">
                                <Layers class="h-4 w-4 text-primary" />
                                <span>Saved Router Profiles</span>
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                @click="showAddModal = true"
                                class="h-7 px-2 text-xs text-primary"
                            >
                                <Plus class="mr-1 h-3.5 w-3.5" /> Add
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent class="space-y-2 max-h-[290px] overflow-y-auto">
                        <div
                            v-for="r in savedRouters"
                            :key="r.id"
                            class="flex items-center justify-between rounded-lg border bg-card p-2.5 transition-colors hover:border-primary/40 hover:bg-muted/30"
                        >
                            <div class="flex items-center gap-2.5 min-w-0">
                                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                    <RouterIcon class="h-4 w-4" />
                                </div>
                                <div class="min-w-0">
                                    <div class="truncate text-xs font-bold text-foreground">
                                        {{ r.name }}
                                    </div>
                                    <div class="font-mono text-[10px] text-muted-foreground">
                                        {{ r.host }}:{{ r.port }} • {{ r.username }}
                                    </div>
                                </div>
                            </div>

                            <Button
                                size="sm"
                                variant="outline"
                                @click="handleConnectSaved(r)"
                                :disabled="connectingRouterId === r.id"
                                class="h-7 gap-1 px-2.5 text-xs font-semibold shrink-0"
                            >
                                <Loader2
                                    v-if="connectingRouterId === r.id"
                                    class="h-3 w-3 animate-spin"
                                />
                                <Play v-else class="h-3 w-3 text-primary fill-primary" />
                                <span>Connect</span>
                            </Button>
                        </div>

                        <div
                            v-if="savedRouters.length === 0"
                            class="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground space-y-2"
                        >
                            <Server class="mx-auto h-8 w-8 opacity-40" />
                            <p>No saved router profiles yet.</p>
                            <p class="text-[11px]">
                                Fill in the login form on the left or try the 1-Click Demo.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <!-- RouterOS Quick Setup Guide Tip -->
                <Card class="border-border/80 bg-muted/30 text-xs">
                    <CardHeader class="pb-2">
                        <CardTitle class="text-xs font-bold flex items-center gap-1.5 text-foreground">
                            <Shield class="h-3.5 w-3.5 text-amber-500" />
                            <span>Enabling RouterOS API</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-2 text-muted-foreground">
                        <p class="text-[11px]">
                            Ensure the RouterOS API service is enabled on your MikroTik terminal:
                        </p>
                        <div class="rounded-md bg-zinc-950 p-2 font-mono text-[11px] text-emerald-400 dark:bg-black">
                            /ip service enable api
                        </div>
                        <p class="text-[10px] text-muted-foreground">
                            Default API port is <b>8728</b> (Plain) and <b>8729</b> (API-SSL).
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>

        <RouterConnectModal
            v-model:open="showAddModal"
            :show-trigger="false"
        />
    </div>
</template>
