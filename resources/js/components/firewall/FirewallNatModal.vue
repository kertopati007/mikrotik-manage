<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import {
    ArrowRightLeft,
    Globe,
    Loader2,
    Network,
    Plus,
    Save,
    Share2,
    Shield,
    SlidersHorizontal,
    Zap,
} from '@lucide/vue';
import { computed, ref, watch } from 'vue';
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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FirewallNatRule } from '@/types/router';

const props = defineProps<{
    open: boolean;
    ruleToEdit?: FirewallNatRule | null;
    interfaces?: Array<{ name: string }>;
}>();

const emit = defineEmits<{
    (e: 'update:open', val: boolean): void;
    (e: 'saved'): void;
}>();

const isSubmitting = ref(false);
const isEditing = computed(() => !!props.ruleToEdit);
const presetMode = ref<'masquerade' | 'dstnat' | 'custom'>('dstnat');

const form = ref({
    chain: 'dstnat',
    action: 'dst-nat',
    protocol: 'tcp',
    src_address: '',
    dst_address: '',
    src_port: '',
    dst_port: '',
    in_interface: '',
    out_interface: '',
    to_addresses: '',
    to_ports: '',
    comment: '',
    disabled: false,
});

const setPreset = (mode: 'masquerade' | 'dstnat' | 'custom') => {
    presetMode.value = mode;

    if (mode === 'masquerade') {
        form.value.chain = 'srcnat';
        form.value.action = 'masquerade';
        form.value.protocol = '';
        form.value.dst_port = '';
        form.value.in_interface = '';
        form.value.to_addresses = '';
        form.value.to_ports = '';
        // Pick first WAN or ether1 if available
        const wan = props.interfaces?.find((i) =>
            i.name.toLowerCase().includes('wan') || i.name.toLowerCase().includes('ether1')
        );
        if (wan) form.value.out_interface = wan.name;
        form.value.comment = 'Internet Sharing (NAT Masquerade)';
    } else if (mode === 'dstnat') {
        form.value.chain = 'dstnat';
        form.value.action = 'dst-nat';
        form.value.protocol = 'tcp';
        form.value.out_interface = '';
        const wan = props.interfaces?.find((i) =>
            i.name.toLowerCase().includes('wan') || i.name.toLowerCase().includes('ether1')
        );
        if (wan) form.value.in_interface = wan.name;
        form.value.comment = 'Port Forwarding Rule';
    } else {
        // Custom
    }
};

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            if (props.ruleToEdit) {
                const r = props.ruleToEdit;
                form.value = {
                    chain: r.chain || 'dstnat',
                    action: r.action || 'dst-nat',
                    protocol: r.protocol || '',
                    src_address: r['src-address'] || '',
                    dst_address: r['dst-address'] || '',
                    src_port: r['src-port'] || '',
                    dst_port: r['dst-port'] || '',
                    in_interface: r['in-interface'] || '',
                    out_interface: r['out-interface'] || '',
                    to_addresses: r['to-addresses'] || '',
                    to_ports: r['to-ports'] || '',
                    comment: r.comment || '',
                    disabled: r.disabled === 'true' || r.disabled === true,
                };
                presetMode.value = 'custom';
            } else {
                setPreset('dstnat');
                form.value.disabled = false;
            }
        }
    }
);

const handleSubmit = () => {
    isSubmitting.value = true;
    const url = isEditing.value
        ? `/firewall/nat/${props.ruleToEdit?.['.id'] || ''}`
        : '/firewall/nat';
    const method = isEditing.value ? 'put' : 'post';

    router[method](url, form.value, {
        preserveScroll: true,
        onSuccess: () => {
            emit('update:open', false);
            emit('saved');
        },
        onFinish: () => {
            isSubmitting.value = false;
        },
    });
};
</script>

<template>
    <Dialog :open="open" @update:open="emit('update:open', $event)">
        <DialogContent class="max-h-[90vh] overflow-y-auto sm:max-w-[580px]">
            <DialogHeader>
                <div class="flex items-center gap-3">
                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
                    >
                        <ArrowRightLeft class="h-5 w-5" />
                    </div>
                    <div>
                        <DialogTitle class="text-base font-bold">
                            {{ isEditing ? 'Edit NAT Rule' : 'New Firewall NAT Rule' }}
                        </DialogTitle>
                        <DialogDescription class="text-xs text-muted-foreground">
                            Configure Masquerade (Internet sharing), Port Forwarding (dst-nat), or Custom NAT.
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <!-- Preset Selector Tabs (Only when creating new rule) -->
            <div v-if="!isEditing" class="grid grid-cols-3 gap-2 py-1">
                <button
                    type="button"
                    @click="setPreset('dstnat')"
                    class="flex flex-col items-center justify-center gap-1.5 rounded-lg border p-2.5 text-center transition-all"
                    :class="
                        presetMode === 'dstnat'
                            ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                            : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/60'
                    "
                >
                    <Network class="h-4 w-4" />
                    <span class="text-[11px]">Port Forward (dst-nat)</span>
                </button>

                <button
                    type="button"
                    @click="setPreset('masquerade')"
                    class="flex flex-col items-center justify-center gap-1.5 rounded-lg border p-2.5 text-center transition-all"
                    :class="
                        presetMode === 'masquerade'
                            ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                            : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/60'
                    "
                >
                    <Globe class="h-4 w-4" />
                    <span class="text-[11px]">Internet Sharing (srcnat)</span>
                </button>

                <button
                    type="button"
                    @click="setPreset('custom')"
                    class="flex flex-col items-center justify-center gap-1.5 rounded-lg border p-2.5 text-center transition-all"
                    :class="
                        presetMode === 'custom'
                            ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                            : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/60'
                    "
                >
                    <SlidersHorizontal class="h-4 w-4" />
                    <span class="text-[11px]">Custom NAT</span>
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4 py-2 text-xs">
                <!-- Row 1: Chain & Action -->
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div class="space-y-1.5">
                        <Label class="font-semibold text-foreground">Chain *</Label>
                        <select
                            v-model="form.chain"
                            class="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
                            required
                        >
                            <option value="dstnat">dstnat (Incoming Port Forwarding / Redirection)</option>
                            <option value="srcnat">srcnat (Outgoing Masquerade / SNAT)</option>
                        </select>
                    </div>

                    <div class="space-y-1.5">
                        <Label class="font-semibold text-foreground">Action *</Label>
                        <select
                            v-model="form.action"
                            class="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
                            required
                        >
                            <option value="dst-nat">dst-nat (Translate destination IP/Port)</option>
                            <option value="masquerade">masquerade (Share outgoing interface IP)</option>
                            <option value="src-nat">src-nat (Translate source IP)</option>
                            <option value="redirect">redirect (Redirect to router local service)</option>
                            <option value="accept">accept</option>
                            <option value="drop">drop</option>
                        </select>
                    </div>
                </div>

                <!-- Destination NAT specific fields (Port Forwarding) -->
                <div
                    v-if="form.action === 'dst-nat' || form.chain === 'dstnat'"
                    class="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-3"
                >
                    <div class="flex items-center gap-1.5 text-primary font-bold text-[11px]">
                        <Network class="h-3.5 w-3.5" />
                        <span>Port Forwarding Target Settings</span>
                    </div>

                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div class="space-y-1.5">
                            <Label class="font-semibold text-foreground">WAN In. Interface</Label>
                            <select
                                v-model="form.in_interface"
                                class="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs"
                            >
                                <option value="">(any WAN / interface)</option>
                                <option
                                    v-for="iface in interfaces"
                                    :key="iface.name"
                                    :value="iface.name"
                                >
                                    {{ iface.name }}
                                </option>
                            </select>
                        </div>

                        <div class="space-y-1.5">
                            <Label class="font-semibold text-foreground">Protocol</Label>
                            <select
                                v-model="form.protocol"
                                class="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs"
                            >
                                <option value="tcp">6 (tcp)</option>
                                <option value="udp">17 (udp)</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div class="space-y-1.5">
                            <Label class="font-semibold text-foreground">WAN Dst. Port</Label>
                            <Input
                                v-model="form.dst_port"
                                placeholder="e.g. 8080 or 80"
                                class="h-8 text-xs font-mono"
                            />
                            <p class="text-[10px] text-muted-foreground">External port</p>
                        </div>

                        <div class="space-y-1.5">
                            <Label class="font-semibold text-foreground">To Addresses (LAN IP) *</Label>
                            <Input
                                v-model="form.to_addresses"
                                placeholder="192.168.88.50"
                                class="h-8 text-xs font-mono"
                                required
                            />
                            <p class="text-[10px] text-muted-foreground">Internal server IP</p>
                        </div>

                        <div class="space-y-1.5">
                            <Label class="font-semibold text-foreground">To Ports (LAN Port)</Label>
                            <Input
                                v-model="form.to_ports"
                                placeholder="e.g. 80"
                                class="h-8 text-xs font-mono"
                            />
                            <p class="text-[10px] text-muted-foreground">Internal port</p>
                        </div>
                    </div>
                </div>

                <!-- Masquerade specific fields -->
                <div
                    v-else-if="form.action === 'masquerade'"
                    class="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-3"
                >
                    <div class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                        <Globe class="h-3.5 w-3.5" />
                        <span>Internet Sharing (Masquerade) Target</span>
                    </div>

                    <div class="space-y-1.5">
                        <Label class="font-semibold text-foreground">Out. Interface (WAN)</Label>
                        <select
                            v-model="form.out_interface"
                            class="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs"
                        >
                            <option value="">(all outgoing interfaces)</option>
                            <option
                                v-for="iface in interfaces"
                                :key="iface.name"
                                :value="iface.name"
                            >
                                {{ iface.name }}
                            </option>
                        </select>
                        <p class="text-[10px] text-muted-foreground">
                            Traffic going out through this interface will have its IP masqueraded with the WAN IP.
                        </p>
                    </div>
                </div>

                <!-- General Address Filters -->
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div class="space-y-1.5">
                        <Label class="font-semibold text-foreground">Src. Address</Label>
                        <Input
                            v-model="form.src_address"
                            placeholder="e.g. 192.168.88.0/24 (optional)"
                            class="h-8 text-xs font-mono"
                        />
                    </div>

                    <div class="space-y-1.5">
                        <Label class="font-semibold text-foreground">Dst. Address</Label>
                        <Input
                            v-model="form.dst_address"
                            placeholder="e.g. 103.140.22.18 (optional)"
                            class="h-8 text-xs font-mono"
                        />
                    </div>
                </div>

                <!-- Comment -->
                <div class="space-y-1.5">
                    <Label class="font-semibold text-foreground">Comment</Label>
                    <Input
                        v-model="form.comment"
                        placeholder="e.g. Web Server Port Forward 8080 -> 80"
                        class="h-8 text-xs"
                    />
                </div>

                <!-- Checkbox disabled -->
                <div class="flex items-center space-x-2 rounded-lg border bg-muted/30 p-2.5">
                    <Checkbox
                        id="nat-disabled"
                        :checked="form.disabled"
                        @update:checked="form.disabled = $event"
                    />
                    <Label for="nat-disabled" class="cursor-pointer font-medium">
                        Disable this NAT Rule
                    </Label>
                </div>

                <DialogFooter class="flex items-center justify-between gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        @click="emit('update:open', false)"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        size="sm"
                        :disabled="isSubmitting"
                        class="gap-1.5"
                    >
                        <Loader2 v-if="isSubmitting" class="h-3.5 w-3.5 animate-spin" />
                        <Save v-else class="h-3.5 w-3.5" />
                        <span>{{ isEditing ? 'Save NAT Rule' : 'Create NAT Rule' }}</span>
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
