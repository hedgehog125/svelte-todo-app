
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/TodoItem.svelte generated by Svelte v3.47.0 */

    const file$2 = "src/TodoItem.svelte";

    function create_fragment$2(ctx) {
    	let main;
    	let t0_value = /*item*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let input;
    	let input_checked_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			t0 = text(t0_value);
    			t1 = space();
    			input = element("input");
    			attr_dev(input, "type", "checkbox");
    			input.checked = input_checked_value = /*item*/ ctx[0].done;
    			attr_dev(input, "aria-label", "If the task has been completed or not. Tick it when it's done");
    			add_location(input, file$2, 14, 4, 213);
    			add_location(main, file$2, 12, 0, 189);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, t0);
    			append_dev(main, t1);
    			append_dev(main, input);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*onchange*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*item*/ 1 && t0_value !== (t0_value = /*item*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*item*/ 1 && input_checked_value !== (input_checked_value = /*item*/ ctx[0].done)) {
    				prop_dev(input, "checked", input_checked_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let item;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TodoItem', slots, []);
    	let { todoItems } = $$props;
    	let { index } = $$props;
    	let { toggleItem } = $$props;

    	let onchange = _ => {
    		toggleItem(index);
    	};

    	const writable_props = ['todoItems', 'index', 'toggleItem'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TodoItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('todoItems' in $$props) $$invalidate(2, todoItems = $$props.todoItems);
    		if ('index' in $$props) $$invalidate(3, index = $$props.index);
    		if ('toggleItem' in $$props) $$invalidate(4, toggleItem = $$props.toggleItem);
    	};

    	$$self.$capture_state = () => ({
    		todoItems,
    		index,
    		toggleItem,
    		onchange,
    		item
    	});

    	$$self.$inject_state = $$props => {
    		if ('todoItems' in $$props) $$invalidate(2, todoItems = $$props.todoItems);
    		if ('index' in $$props) $$invalidate(3, index = $$props.index);
    		if ('toggleItem' in $$props) $$invalidate(4, toggleItem = $$props.toggleItem);
    		if ('onchange' in $$props) $$invalidate(1, onchange = $$props.onchange);
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*todoItems, index*/ 12) {
    			$$invalidate(0, item = todoItems[index]);
    		}
    	};

    	return [item, onchange, todoItems, index, toggleItem];
    }

    class TodoItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { todoItems: 2, index: 3, toggleItem: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TodoItem",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*todoItems*/ ctx[2] === undefined && !('todoItems' in props)) {
    			console.warn("<TodoItem> was created without expected prop 'todoItems'");
    		}

    		if (/*index*/ ctx[3] === undefined && !('index' in props)) {
    			console.warn("<TodoItem> was created without expected prop 'index'");
    		}

    		if (/*toggleItem*/ ctx[4] === undefined && !('toggleItem' in props)) {
    			console.warn("<TodoItem> was created without expected prop 'toggleItem'");
    		}
    	}

    	get todoItems() {
    		throw new Error("<TodoItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set todoItems(value) {
    		throw new Error("<TodoItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<TodoItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<TodoItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggleItem() {
    		throw new Error("<TodoItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggleItem(value) {
    		throw new Error("<TodoItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/TodoBar.svelte generated by Svelte v3.47.0 */

    const file$1 = "src/TodoBar.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let input;
    	let t0;
    	let button0;
    	let t1;
    	let button0_disabled_value;
    	let t2;
    	let button1;
    	let t3;
    	let button1_disabled_value;
    	let t4;
    	let br;
    	let t5;
    	let t6_value = /*taskCount*/ ctx[2] - /*completedCount*/ ctx[1] + "";
    	let t6;
    	let t7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			input = element("input");
    			t0 = space();
    			button0 = element("button");
    			t1 = text("Add");
    			t2 = space();
    			button1 = element("button");
    			t3 = text("Delete among us");
    			t4 = space();
    			br = element("br");
    			t5 = space();
    			t6 = text(t6_value);
    			t7 = text(" tasks left");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "What do you need to do?");
    			attr_dev(input, "aria-label", "The task you want to add to your to do list");
    			add_location(input, file$1, 15, 4, 233);
    			attr_dev(button0, "type", "button");
    			button0.disabled = button0_disabled_value = /*text*/ ctx[3] == "";
    			add_location(button0, file$1, 16, 4, 372);
    			attr_dev(button1, "type", "button");
    			button1.disabled = button1_disabled_value = /*completedCount*/ ctx[1] == 0;
    			add_location(button1, file$1, 17, 4, 450);
    			add_location(br, file$1, 19, 4, 560);
    			add_location(main, file$1, 14, 0, 222);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, input);
    			set_input_value(input, /*text*/ ctx[3]);
    			append_dev(main, t0);
    			append_dev(main, button0);
    			append_dev(button0, t1);
    			append_dev(main, t2);
    			append_dev(main, button1);
    			append_dev(button1, t3);
    			append_dev(main, t4);
    			append_dev(main, br);
    			append_dev(main, t5);
    			append_dev(main, t6);
    			append_dev(main, t7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[6]),
    					listen_dev(button0, "click", /*onAdd*/ ctx[4], false, false, false),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*deleteCompleted*/ ctx[0])) /*deleteCompleted*/ ctx[0].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*text*/ 8 && input.value !== /*text*/ ctx[3]) {
    				set_input_value(input, /*text*/ ctx[3]);
    			}

    			if (dirty & /*text*/ 8 && button0_disabled_value !== (button0_disabled_value = /*text*/ ctx[3] == "")) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty & /*completedCount*/ 2 && button1_disabled_value !== (button1_disabled_value = /*completedCount*/ ctx[1] == 0)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (dirty & /*taskCount, completedCount*/ 6 && t6_value !== (t6_value = /*taskCount*/ ctx[2] - /*completedCount*/ ctx[1] + "")) set_data_dev(t6, t6_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TodoBar', slots, []);
    	let { addItem } = $$props;
    	let { deleteCompleted } = $$props;
    	let { completedCount } = $$props;
    	let { taskCount } = $$props;
    	let text = "";

    	const onAdd = _ => {
    		addItem(text);
    		$$invalidate(3, text = "");
    	};

    	const writable_props = ['addItem', 'deleteCompleted', 'completedCount', 'taskCount'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TodoBar> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		text = this.value;
    		$$invalidate(3, text);
    	}

    	$$self.$$set = $$props => {
    		if ('addItem' in $$props) $$invalidate(5, addItem = $$props.addItem);
    		if ('deleteCompleted' in $$props) $$invalidate(0, deleteCompleted = $$props.deleteCompleted);
    		if ('completedCount' in $$props) $$invalidate(1, completedCount = $$props.completedCount);
    		if ('taskCount' in $$props) $$invalidate(2, taskCount = $$props.taskCount);
    	};

    	$$self.$capture_state = () => ({
    		addItem,
    		deleteCompleted,
    		completedCount,
    		taskCount,
    		text,
    		onAdd
    	});

    	$$self.$inject_state = $$props => {
    		if ('addItem' in $$props) $$invalidate(5, addItem = $$props.addItem);
    		if ('deleteCompleted' in $$props) $$invalidate(0, deleteCompleted = $$props.deleteCompleted);
    		if ('completedCount' in $$props) $$invalidate(1, completedCount = $$props.completedCount);
    		if ('taskCount' in $$props) $$invalidate(2, taskCount = $$props.taskCount);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		deleteCompleted,
    		completedCount,
    		taskCount,
    		text,
    		onAdd,
    		addItem,
    		input_input_handler
    	];
    }

    class TodoBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			addItem: 5,
    			deleteCompleted: 0,
    			completedCount: 1,
    			taskCount: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TodoBar",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*addItem*/ ctx[5] === undefined && !('addItem' in props)) {
    			console.warn("<TodoBar> was created without expected prop 'addItem'");
    		}

    		if (/*deleteCompleted*/ ctx[0] === undefined && !('deleteCompleted' in props)) {
    			console.warn("<TodoBar> was created without expected prop 'deleteCompleted'");
    		}

    		if (/*completedCount*/ ctx[1] === undefined && !('completedCount' in props)) {
    			console.warn("<TodoBar> was created without expected prop 'completedCount'");
    		}

    		if (/*taskCount*/ ctx[2] === undefined && !('taskCount' in props)) {
    			console.warn("<TodoBar> was created without expected prop 'taskCount'");
    		}
    	}

    	get addItem() {
    		throw new Error("<TodoBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set addItem(value) {
    		throw new Error("<TodoBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get deleteCompleted() {
    		throw new Error("<TodoBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set deleteCompleted(value) {
    		throw new Error("<TodoBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get completedCount() {
    		throw new Error("<TodoBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set completedCount(value) {
    		throw new Error("<TodoBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get taskCount() {
    		throw new Error("<TodoBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set taskCount(value) {
    		throw new Error("<TodoBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const findID = arr => {
        let id = 0;
        while (true) {
            if (! arr.some(value => value == id || value?.id == id)) {
                return id;
            }
            id++;
        }
    };

    /* src/App.svelte generated by Svelte v3.47.0 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (37:1) {#each todoItems as item, index (item.id)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let todoitem;
    	let current;

    	todoitem = new TodoItem({
    			props: {
    				todoItems: /*todoItems*/ ctx[0],
    				index: /*index*/ ctx[7],
    				toggleItem: /*toggleItem*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(todoitem.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(todoitem, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const todoitem_changes = {};
    			if (dirty & /*todoItems*/ 1) todoitem_changes.todoItems = /*todoItems*/ ctx[0];
    			if (dirty & /*todoItems*/ 1) todoitem_changes.index = /*index*/ ctx[7];
    			todoitem.$set(todoitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(todoitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(todoitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(todoitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(37:1) {#each todoItems as item, index (item.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t;
    	let todobar;
    	let current;
    	let each_value = /*todoItems*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[5].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	todobar = new TodoBar({
    			props: {
    				addItem: /*addItem*/ ctx[2],
    				deleteCompleted: /*deleteCompleted*/ ctx[3],
    				completedCount: /*completed*/ ctx[1].length,
    				taskCount: /*todoItems*/ ctx[0].length
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			create_component(todobar.$$.fragment);
    			add_location(main, file, 35, 0, 867);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			append_dev(main, t);
    			mount_component(todobar, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*todoItems, toggleItem*/ 17) {
    				each_value = /*todoItems*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, main, outro_and_destroy_block, create_each_block, t, get_each_context);
    				check_outros();
    			}

    			const todobar_changes = {};
    			if (dirty & /*completed*/ 2) todobar_changes.completedCount = /*completed*/ ctx[1].length;
    			if (dirty & /*todoItems*/ 1) todobar_changes.taskCount = /*todoItems*/ ctx[0].length;
    			todobar.$set(todobar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(todobar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(todobar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			destroy_component(todobar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const STORAGE_KEY = "todoItems";

    function instance($$self, $$props, $$invalidate) {
    	let completed;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let todoItems = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];

    	const addItem = item => {
    		todoItems.push({
    			name: item,
    			done: false,
    			id: findID(todoItems)
    		});

    		$$invalidate(0, todoItems);
    	};

    	const deleteCompleted = _ => {
    		$$invalidate(0, todoItems = todoItems.filter(item => !item.done));
    	};

    	const toggleItem = index => {
    		let item = todoItems[index];
    		$$invalidate(0, todoItems[index] = { ...item, done: !item.done }, todoItems);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		STORAGE_KEY,
    		TodoItem,
    		TodoBar,
    		findID,
    		todoItems,
    		addItem,
    		deleteCompleted,
    		toggleItem,
    		completed
    	});

    	$$self.$inject_state = $$props => {
    		if ('todoItems' in $$props) $$invalidate(0, todoItems = $$props.todoItems);
    		if ('completed' in $$props) $$invalidate(1, completed = $$props.completed);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*todoItems*/ 1) {
    			$$invalidate(1, completed = todoItems.filter(item => item.done));
    		}

    		if ($$self.$$.dirty & /*todoItems*/ 1) {
    			{
    				localStorage.setItem(STORAGE_KEY, JSON.stringify(todoItems));
    			}
    		}
    	};

    	return [todoItems, completed, addItem, deleteCompleted, toggleItem];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
