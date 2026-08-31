<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import {
    Activity,
    AlertCircle,
    CheckCircle2,
    Eye,
    EyeOff,
    Loader2,
    Plus,
    Router as RouterIcon,
    Server,
    Shield,
    Zap,
} from '@lucide/vue';
import { ref, watch } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const props = defineProps<{
    triggerClass?: string;
    showTrigger?: boolean;
    open?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:open', val: boolean): void;
    (e: 'connected'): void;
}>();

const isOpen = ref(props.open ?? false);

watch(
    () => props.open,
    (val) => {
        if (val !== undefined) {
            isOpen.value = val;
        }
    },
    { immediate: true }
);

watch(isOpen, (val) => {
    emit('update:open', val);
});
const showPassword = ref(false);
const isTesting = ref(false);
const isSubmitting = ref(false);
const testResult = ref<{
    success: boolean;
    message: string;
    latency_ms?: number;
    identity?: string;
    version?: string;
} | null>(null);

const form = ref({
    name: 'MikroTik Core Router',
    host: '192.168.88.1',
    port: 8728,
    username: 'admin',
    password: '',
    use_ssl: false,
    auto_connect: true,
});

const onSslChange = (checked: boolean) => {
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

const handleSubmit = () => {
    isSubmitting.value = true;
    router.post('/routers', form.value, {
        onSuccess: () => {
            isOpen.value = false;
            emit('update:open', false);
            emit('connected');
        },
        onFinish: () => {
            isSubmitting.value = false;
        },
    });
};

const fillDemoCredentials = () => {
    form.value = {
        name: 'Office RB750Gr3 (Demo)',
        host: 'demo.mikrotik.com',
        port: 8728,
        username: 'admin',
        password: '',
        use_ssl: false,
        auto_connect: true,
    };
    testResult.value = null;
};
</script>

<template>
    <Dialog v-model:open="isOpen" @update:open="emit('update:open', $event)">
        <DialogTrigger as-child v-if="showTrigger !== false">
            <Button :class="triggerClass" class="gap-2">
                <Plus class="h-4 w-4" />
                <span>Add & Connect Router</span>
            </Button>
        </DialogTrigger>

        <DialogContent class="sm:max-w-[540px]">
            <DialogHeader>
                <div class="flex items-center gap-3">
                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
                    >
                        <RouterIcon class="h-5 w-5" />
                    </div>
                    <div>
                        <DialogTitle class="text-lg font-bold"
                            >Connect MikroTik Router</DialogTitle
                        >
                        <DialogDescription class="text-xs text-muted-foreground">
                            Enter your RouterOS API credentials to start an active session.
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-4 py-2">
                <div class="grid grid-cols-2 gap-3">
                    <div class="col-span-2 space-y-1.5">
                        <div class="flex items-center justify-between">
                            <Label for="router-name" class="text-xs font-semibold"
                                >Router Label / Name</Label
                            >
                            <button
                                type="button"
                                @click="fillDemoCredentials"
                                class="text-xs font-medium text-primary hover:underline"
                            >
                                ✨ Fill Demo Info
                            </button>
                        </div>
                        <Input
                            id="router-name"
                            v-model="form.name"
                            placeholder="e.g. Core Gateway RB750Gr3"
                            required
                            class="h-9 text-sm"
                        />
                    </div>

                    <div class="space-y-1.5">
                        <Label for="router-host" class="text-xs font-semibold"
                            >IP Address / Host</Label
                        >
                        <div class="relative">
                            <Input
                                id="router-host"
                                v-model="form.host"
                                placeholder="192.168.88.1"
                                required
                                class="h-9 text-sm"
                            />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <Label for="router-port" class="text-xs font-semibold"
                            >API Port</Label
                        >
                        <Input
                            id="router-port"
                            type="number"
                            v-model.number="form.port"
                            placeholder="8728"
                            required
                            class="h-9 text-sm"
                        />
                    </div>

                    <div class="space-y-1.5">
                        <Label for="router-username" class="text-xs font-semibold"
                            >Username</Label
                        >
                        <Input
                            id="router-username"
                            v-model="form.username"
                            placeholder="admin"
                            required
                            class="h-9 text-sm"
                        />
                    </div>

                    <div class="space-y-1.5">
                        <Label for="router-password" class="text-xs font-semibold"
                            >Password</Label
                        >
                        <div class="relative">
                            <Input
                                id="router-password"
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
                            id="use-ssl"
                            :checked="form.use_ssl"
                            @update:checked="onSslChange"
                        />
                        <Label
                            for="use-ssl"
                            class="cursor-pointer text-xs font-medium"
                        >
                            Use SSL / TLS (Port 8729)
                        </Label>
                    </div>
                    <div class="flex items-center space-x-2">
                        <Checkbox
                            id="auto-connect"
                            :checked="form.auto_connect"
                            @update:checked="form.auto_connect = $event"
                        />
                        <Label
                            for="auto-connect"
                            class="cursor-pointer text-xs font-medium text-muted-foreground"
                        >
                            Activate Session
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
                        <AlertCircle
                            v-else
                            class="mt-0.5 h-4 w-4 shrink-0 text-destructive"
                        />
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

                <DialogFooter class="flex items-center justify-between gap-2 pt-2 sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        @click="handleTestConnection"
                        :disabled="isTesting || isSubmitting"
                        class="gap-1.5 text-xs"
                    >
                        <Loader2
                            v-if="isTesting"
                            class="h-3.5 w-3.5 animate-spin"
                        />
                        <Activity v-else class="h-3.5 w-3.5 text-primary" />
                        <span>{{ isTesting ? 'Testing...' : 'Test Connection' }}</span>
                    </Button>

                    <div class="flex gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            @click="isOpen = false"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            :disabled="isSubmitting"
                            class="gap-1.5"
                        >
                            <Loader2
                                v-if="isSubmitting"
                                class="h-3.5 w-3.5 animate-spin"
                            />
                            <Server v-else class="h-3.5 w-3.5" />
                            <span>Save & Connect</span>
                        </Button>
                    </div>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
