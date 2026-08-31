<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import {
    Activity,
    CheckCircle2,
    Flame,
    Loader2,
    Plus,
    Save,
    Shield,
    ShieldAlert,
    ShieldCheck,
    X,
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
import type { FirewallAddressList, FirewallFilterRule } from '@/types/router';

const props = defineProps<{
    open: boolean;
    ruleToEdit?: FirewallFilterRule | null;
    interfaces?: Array<{ name: string }>;
    addressLists?: FirewallAddressList[];
}>();

const emit = defineEmits<{
    (e: 'update:open', val: boolean): void;
    (e: 'saved'): void;
}>();

const isSubmitting = ref(false);
const isEditing = computed(() => !!props.ruleToEdit);

const form = ref({
    chain: 'forward',
    action: 'accept',
    protocol: '',
    src_address: '',
    dst_address: '',
    src_port: '',
    dst_port: '',
    in_interface: '',
    out_interface: '',
    src_address_list: '',
    dst_address_list: '',
    connection_state: '',
    comment: '',
    disabled: false,
    log: false,
});

const connectionStates = ['established', 'related', 'new', 'invalid', 'untracked'];
const selectedStates = ref<string[]>([]);

const uniqueAddressLists = computed(() => {
    if (!props.addressLists) return [];
    return Array.from(new Set(props.addressLists.map((a) => a.list)));
});

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            if (props.ruleToEdit) {
                const r = props.ruleToEdit;
                form.value = {
                    chain: r.chain || 'forward',
                    action: r.action || 'accept',
                    protocol: r.protocol || '',
                    src_address: r['src-address'] || '',
                    dst_address: r['dst-address'] || '',
                    src_port: r['src-port'] || '',
                    dst_port: r['dst-port'] || '',
                    in_interface: r['in-interface'] || '',
                    out_interface: r['out-interface'] || '',
                    src_address_list: r['src-address-list'] || '',
                    dst_address_list: r['dst-address-list'] || '',
                    connection_state: r['connection-state'] || '',
                    comment: r.comment || '',
                    disabled: r.disabled === 'true' || r.disabled === true,
                    log: r.log === 'true' || r.log === true,
                };
                selectedStates.value = r['connection-state'] ? r['connection-state'].split(',') : [];
            } else {
                form.value = {
                    chain: 'forward',
                    action: 'accept',
                    protocol: '',
                    src_address: '',
                    dst_address: '',
                    src_port: '',
                    dst_port: '',
                    in_interface: '',
                    out_interface: '',
                    src_address_list: '',
                    dst_address_list: '',
                    connection_state: '',
                    comment: '',
                    disabled: false,
                    log: false,
                };
                selectedStates.value = [];
            }
        }
    }
);

const toggleState = (state: string) => {
    if (selectedStates.value.includes(state)) {
        selectedStates.value = selectedStates.value.filter((s) => s !== state);
    } else {
        selectedStates.value.push(state);
    }
    form.value.connection_state = selectedStates.value.join(',');
};

const handleSubmit = () => {
    isSubmitting.value = true;
    const url = isEditing.value
        ? `/firewall/filter/${props.ruleToEdit?.['.id'] || ''}`
        : '/firewall/filter';
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
        <DialogContent class="max-h-[90vh] overflow-y-auto sm:max-w-[620px]">
            <DialogHeader>
                <div class="flex items-center gap-3">
                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
                    >
                        <Shield class="h-5 w-5" />
                    </div>
                    <div>
                        <DialogTitle class="text-base font-bold">
                            {{ isEditing ? 'Edit Firewall Filter Rule' : 'New Firewall Filter Rule' }}
                        </DialogTitle>
                        <DialogDescription class="text-xs text-muted-foreground">
                            Configure packet inspection, traffic filter chains, and security policies.
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>

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
                            <option value="forward">forward (routed through router)</option>
                            <option value="input">input (destined to router itself)</option>
                            <option value="output">output (originated from router)</option>
                        </select>
                    </div>

                    <div class="space-y-1.5">
                        <Label class="font-semibold text-foreground">Action *</Label>
                        <select
                            v-model="form.action"
                            class="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
                            required
                        >
                            <option value="accept">accept</option>
                            <option value="drop">drop (silent discard)</option>
                            <option value="reject">reject (ICMP notify)</option>
                            <option value="fasttrack-connection">fasttrack-connection</option>
                            <option value="passthrough">passthrough</option>
                            <option value="jump">jump</option>
                            <option value="return">return</option>
                            <option value="log">log only</option>
                        </select>
                    </div>
                </div>

                <!-- Row 2: Protocol & Ports -->
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div class="space-y-1.5">
                        <Label class="font-semibold text-foreground">Protocol</Label>
                        <select
                            v-model="form.protocol"
                            class="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
                        >
                            <option value="">(any protocol)</option>
                            <option value="tcp">6 (tcp)</option>
                            <option value="udp">17 (udp)</option>
                            <option value="icmp">1 (icmp)</option>
                            <option value="gre">47 (gre)</option>
                            <option value="ipsec-esp">50 (ipsec-esp)</option>
                            <option value="ipsec-ah">51 (ipsec-ah)</option>
                        </select>
                    </div>

                    <div class="space-y-1.5">
                        <Label class="font-semibold text-foreground">Src. Port</Label>
                        <Input
                            v-model="form.src_port"
                            placeholder="e.g. 80,443 or 1024-65535"
                            class="h-8 text-xs font-mono"
                        />
                    </div>

                    <div class="space-y-1.5">
                        <Label class="font-semibold text-foreground">Dst. Port</Label>
                        <Input
                            v-model="form.dst_port"
                            placeholder="e.g. 80,443,22"
                            class="h-8 text-xs font-mono"
                        />
                    </div>
                </div>

                <!-- Row 3: IP Addresses -->
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div class="space-y-1.5">
                        <Label class="font-semibold text-foreground">Src. Address</Label>
                        <Input
                            v-model="form.src_address"
                            placeholder="e.g. 192.168.88.0/24 or !10.0.0.1"
                            class="h-8 text-xs font-mono"
                        />
                    </div>

                    <div class="space-y-1.5">
                        <Label class="font-semibold text-foreground">Dst. Address</Label>
                        <Input
                            v-model="form.dst_address"
                            placeholder="e.g. 10.10.10.50 or 0.0.0.0/0"
                            class="h-8 text-xs font-mono"
                        />
                    </div>
                </div>

                <!-- Row 4: Interfaces -->
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div class="space-y-1.5">
                        <Label class="font-semibold text-foreground">In. Interface</Label>
                        <select
                            v-model="form.in_interface"
                            class="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
                        >
                            <option value="">(any in-interface)</option>
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
                        <Label class="font-semibold text-foreground">Out. Interface</Label>
                        <select
                            v-model="form.out_interface"
                            class="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
                        >
                            <option value="">(any out-interface)</option>
                            <option
                                v-for="iface in interfaces"
                                :key="iface.name"
                                :value="iface.name"
                            >
                                {{ iface.name }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Row 5: Address Lists Match -->
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div class="space-y-1.5">
                        <Label class="font-semibold text-foreground">Src. Address List</Label>
                        <select
                            v-model="form.src_address_list"
                            class="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
                        >
                            <option value="">(none)</option>
                            <option
                                v-for="listName in uniqueAddressLists"
                                :key="listName"
                                :value="listName"
                            >
                                {{ listName }}
                            </option>
                        </select>
                    </div>

                    <div class="space-y-1.5">
                        <Label class="font-semibold text-foreground">Dst. Address List</Label>
                        <select
                            v-model="form.dst_address_list"
                            class="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
                        >
                            <option value="">(none)</option>
                            <option
                                v-for="listName in uniqueAddressLists"
                                :key="listName"
                                :value="listName"
                            >
                                {{ listName }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Row 6: Connection States -->
                <div class="space-y-1.5">
                    <Label class="font-semibold text-foreground">Connection State</Label>
                    <div class="flex flex-wrap gap-1.5">
                        <button
                            v-for="st in connectionStates"
                            :key="st"
                            type="button"
                            @click="toggleState(st)"
                            class="rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors"
                            :class="
                                selectedStates.includes(st)
                                    ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                                    : 'border-border bg-muted/40 text-muted-foreground hover:text-foreground'
                            "
                        >
                            {{ st }}
                        </button>
                    </div>
                </div>

                <!-- Row 7: Comment -->
                <div class="space-y-1.5">
                    <Label class="font-semibold text-foreground">Comment / Rule Description</Label>
                    <Input
                        v-model="form.comment"
                        placeholder="e.g. Block Port Scanners, Allow ICMP Ping, etc."
                        class="h-8 text-xs"
                    />
                </div>

                <!-- Row 8: Checkboxes -->
                <div class="flex flex-wrap items-center gap-4 rounded-lg border bg-muted/30 p-2.5">
                    <div class="flex items-center space-x-2">
                        <Checkbox
                            id="filter-disabled"
                            :checked="form.disabled"
                            @update:checked="form.disabled = $event"
                        />
                        <Label for="filter-disabled" class="cursor-pointer font-medium">
                            Disable this Rule
                        </Label>
                    </div>

                    <div class="flex items-center space-x-2">
                        <Checkbox
                            id="filter-log"
                            :checked="form.log"
                            @update:checked="form.log = $event"
                        />
                        <Label for="filter-log" class="cursor-pointer font-medium text-muted-foreground">
                            Log Packets to Router Log
                        </Label>
                    </div>
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
                        <span>{{ isEditing ? 'Save Changes' : 'Create Filter Rule' }}</span>
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
