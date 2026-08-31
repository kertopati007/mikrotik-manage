<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { Loader2, Sliders, X } from '@lucide/vue';
import { watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { PPPProfile } from '@/types/router';

const props = defineProps<{
    open: boolean;
    profile?: PPPProfile | null;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

const form = useForm({
    name: '',
    local_address: '',
    remote_address: '',
    rate_limit: '',
    only_one: 'default',
    dns_server: '',
    use_encryption: 'default',
    comment: '',
});

watch(
    () => props.profile,
    (newProfile) => {
        if (newProfile) {
            form.name = newProfile.name || '';
            form.local_address = newProfile['local-address'] || '';
            form.remote_address = newProfile['remote-address'] || '';
            form.rate_limit = newProfile['rate-limit'] || '';
            form.only_one = typeof newProfile['only-one'] === 'string' ? newProfile['only-one'] : (newProfile['only-one'] ? 'yes' : 'default');
            form.dns_server = newProfile['dns-server'] || '';
            form.use_encryption = typeof newProfile['use-encryption'] === 'string' ? newProfile['use-encryption'] : 'default';
            form.comment = newProfile.comment || '';
        } else {
            form.reset();
            form.only_one = 'default';
            form.use_encryption = 'default';
        }
    },
    { immediate: true }
);

const handleSubmit = () => {
    if (props.profile && props.profile['.id']) {
        const id = props.profile['.id'];
        form.put(`/ppp/profile/${encodeURIComponent(id)}`, {
            preserveScroll: true,
            onSuccess: () => {
                emit('close');
            },
        });
    } else {
        form.post('/ppp/profile', {
            preserveScroll: true,
            onSuccess: () => {
                emit('close');
                form.reset();
            },
        });
    }
};
</script>

<template>
    <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-all"
    >
        <Card class="w-full max-w-lg border-border/80 bg-card shadow-2xl">
            <CardHeader class="flex flex-row items-center justify-between border-b pb-3">
                <CardTitle class="flex items-center gap-2 text-base font-bold">
                    <Sliders class="h-4 w-4 text-primary" />
                    <span>{{ profile ? 'Edit PPP Profile' : 'Add New PPP Profile' }}</span>
                </CardTitle>
                <button
                    @click="emit('close')"
                    class="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden"
                >
                    <X class="h-4 w-4" />
                </button>
            </CardHeader>

            <CardContent class="pt-4">
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <!-- Profile Name & Rate Limit -->
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div class="space-y-1">
                            <label class="text-xs font-semibold text-muted-foreground">Profile Name *</label>
                            <Input
                                v-model="form.name"
                                type="text"
                                required
                                placeholder="e.g. 10Mbps-Home"
                                class="h-8 text-xs font-mono"
                            />
                            <p v-if="form.errors.name" class="text-[11px] text-destructive">
                                {{ form.errors.name }}
                            </p>
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs font-semibold text-muted-foreground">Rate Limit (Rx/Tx)</label>
                            <Input
                                v-model="form.rate_limit"
                                type="text"
                                placeholder="e.g. 1M/10M or 512k/5M"
                                class="h-8 text-xs font-mono"
                            />
                            <span class="text-[10px] text-muted-foreground">Format: [Upload]/[Download]</span>
                        </div>
                    </div>

                    <!-- Local Address & Remote Address -->
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div class="space-y-1">
                            <label class="text-xs font-semibold text-muted-foreground">Local Address (Gateway)</label>
                            <Input
                                v-model="form.local_address"
                                type="text"
                                placeholder="e.g. 10.0.0.1 or pool-name"
                                class="h-8 text-xs font-mono"
                            />
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs font-semibold text-muted-foreground">Remote Address (Pool / IP)</label>
                            <Input
                                v-model="form.remote_address"
                                type="text"
                                placeholder="e.g. dhcp_pool_ppp"
                                class="h-8 text-xs font-mono"
                            />
                        </div>
                    </div>

                    <!-- DNS Server & Only One -->
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div class="space-y-1">
                            <label class="text-xs font-semibold text-muted-foreground">DNS Server</label>
                            <Input
                                v-model="form.dns_server"
                                type="text"
                                placeholder="e.g. 8.8.8.8, 1.1.1.1"
                                class="h-8 text-xs font-mono"
                            />
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs font-semibold text-muted-foreground">Only One Session</label>
                            <select
                                v-model="form.only_one"
                                class="h-8 w-full rounded-md border border-input bg-background px-2 text-xs shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring font-mono"
                            >
                                <option value="default">default</option>
                                <option value="yes">yes (1 login per user)</option>
                                <option value="no">no (multi-login)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Comment -->
                    <div class="space-y-1">
                        <label class="text-xs font-semibold text-muted-foreground">Comment / Note</label>
                        <Input
                            v-model="form.comment"
                            type="text"
                            placeholder="e.g. Paket Internet Rumahan 10Mbps Unlimited"
                            class="h-8 text-xs"
                        />
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center justify-end gap-2 pt-3 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            class="h-8 text-xs"
                            @click="emit('close')"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            size="sm"
                            class="h-8 text-xs font-semibold"
                            :disabled="form.processing"
                        >
                            <Loader2 v-if="form.processing" class="mr-1.5 h-3.5 w-3.5 animate-spin" />
                            <span>{{ profile ? 'Save Changes' : 'Create PPP Profile' }}</span>
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
</template>
