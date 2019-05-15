import fuzzysearch from 'fuzzysearch'

import {
  warning,
  quickDiff, onlyOnLeftClick,
  debounce, identity,
  hasOwn, last, find, removeFromArray,
} from '../utils'

import {
  UNCHECKED, INDETERMINATE, CHECKED,
  UNMATCHED, DESCENDANT_MATCHED, MATCHED,
  NO_PARENT_NODE,
  ALL, BRANCH_PRIORITY, LEAF_PRIORITY,
  ALL_CHILDREN, ALL_DESCENDANTS, LEAF_CHILDREN, LEAF_DESCENDANTS,
  ORDER_SELECTED, LEVEL, INDEX,
  INPUT_DEBOUNCE_DELAY,
} from '../constants'

function sortValueByIndex(a, b) {
  let i = 0
  do {
    if (a.level < i) return -1
    if (b.level < i) return 1
    if (a.index[i] !== b.index[i]) return a.index[i] - b.index[i]
    i++
  } while (true)
}

function sortValueByLevel(a, b) {
  return a.level !== b.level
    ? a.level - b.level
    : sortValueByIndex(a, b)
}

function limitTextDefault(count) {
  return `and ${count} more`
}

function loadChildrenErrorTextDefault(error) {
  const reason = error.message || /* istanbul ignore next */ String(error)
  return `Failed to load children options: ${reason}.`
}

export default {
  provide() {
    return {
      // enable access to the instance of root component of vue-treeselect across hierarchy
      instance: this,

      // constants
      UNCHECKED,
      INDETERMINATE,
      CHECKED,
      UNMATCHED,
      DESCENDANT_MATCHED,
      MATCHED,
    }
  },

  props: {
    /**
     * Whether the menu should be always open
     */
    alwaysOpen: {
      type: Boolean,
      default: false,
    },

    /**
     * Deprecated. Use `autoFocus` instead.
     */
    autofocus: {
      type: Boolean,
      default: false,
    },

    /**
     * Automatically focus the component on mount?
     */
    autoFocus: {
      type: Boolean,
      default: false,
    },

    /**
     * Automatically load root options on mount. When set to `false`, root options will be loaded when the menu is opened.
     */
    autoLoadRootOptions: {
      type: Boolean,
      default: true,
    },

    /**
     * Whether pressing backspace key removes the last item if there is no text input
     */
    backspaceRemoves: {
      type: Boolean,
      default: true,
    },

    /**
     * Show branch nodes before leaf nodes?
     */
    branchNodesFirst: {
      type: Boolean,
      default: false,
    },

    /**
     * Show an "×" icon that resets value?
     */
    clearable: {
      type: Boolean,
      default: true,
    },

    /**
     * Title for the "×" icon when multiple: true
     */
    clearAllText: {
      type: String,
      default: 'Clear all',
    },

    /**
     * Whether to clear the search input after selecting.
     * Use only when `multiple` is `true`.
     * For single-select mode, it **always** clears the input after selecting an option regardless of the prop value.
     */
    clearOnSelect: {
      type: Boolean,
      default: false,
    },

    /**
     * Title for the "×" icon
     */
    clearValueText: {
      type: String,
      default: 'Clear value',
    },

    /**
     * Whether to close the menu after selecting an option?
     * Use only when `multiple` is `true`.
     */
    closeOnSelect: {
      type: Boolean,
      default: true,
    },

    /**
     * How many levels of branch nodes should be automatically expanded when loaded.
     * Set `Infinity` to make all branch nodes expanded by default.
     */
    defaultExpandLevel: {
      type: Number,
      default: 0,
    },

    /**
     * Whether pressing delete key removes the last item if there is no text input
     */
    deleteRemoves: {
      type: Boolean,
      default: true,
    },

    /**
     * Delimiter to use to join multiple values for the hidden field value
     */
    delimiter: {
      type: String,
      default: ',',
    },

    /**
     * Prevent branch nodes from being selected?
     */
    disableBranchNodes: {
      type: Boolean,
      default: false,
    },

    /**
     * Disable the control?
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Disable the fuzzy matching functionality?
     */
    disableFuzzyMatching: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether escape clears the value when the menu is closed
     */
    escapeClearsValue: {
      type: Boolean,
      default: true,
    },

    /**
     * Whether to enable flat mode or not. Non-flat mode (default) means:
     *   - Whenever a branch node gets checked, all its children will be checked too
     *   - Whenever a branch node has all children checked, the branch node itself will be checked too
     * Set `true` to disable this mechanism
     */
    flat: {
      type: Boolean,
      default: false,
    },

    /**
     * Will be passed with all events as second param.
     * Useful for identifying events origin.
     * @type {string|number}
    */
    id: {
      default: null,
    },

    /**
     * Joins multiple values into a single form field with the delimiter (legacy mode)
    */
    joinValues: {
      type: Boolean,
      default: false,
    },

    /**
     * Limit the display of selected options.
     * The rest will be hidden within the limitText string.
     */
    limit: {
      type: Number,
      default: Infinity,
    },

    /**
     * Function that processes the message shown when selected elements pass the defined limit
     * @type {function(number): string}
     */
    limitText: {
      type: Function,
      default: limitTextDefault,
    },

    /**
     * Function that processes error message shown when loading children options failed
     * @type {function(Error): string}
     */
    loadChildrenErrorText: {
      type: Function,
      default: loadChildrenErrorTextDefault,
    },

    /**
     * Function used for dynamic loading options
     */
    loadChildrenOptions: {
      type: Function,
    },

    /**
     * Text displayed when a branch node is loading its children options
     */
    loadingText: {
      type: String,
      default: 'Loading...',
    },

    /**
     * Function used for dynamic loading root options
     */
    loadRootOptions: {
      type: Function,
    },

    /**
     * Sets `maxHeight` style value of the menu
     */
    maxHeight: {
      type: Number,
      default: 300,
    },

    /**
     * Set `true` to allow selecting multiple options (a.k.a., multi-select mode)
     */
    multiple: {
      type: Boolean,
      default: false,
    },

    /**
     * Generates a hidden <input /> tag with this field name for html forms
     */
    name: {
      type: String,
    },

    /**
     * Text displayed when a branch node has no children options
     */
    noChildrenText: {
      type: String,
      default: 'No children options...',
    },

    /**
     * Text displayed when there are no available options
     */
    noOptionsText: {
      type: String,
      default: 'No options available.',
    },

    /**
     * Text displayed when there are no matching search results
     */
    noResultsText: {
      type: String,
      default: 'No results found...',
    },

    /**
     * Used for normalizing source data
     */
    normalizer: {
      type: Function,
      default: identity,
    },

    /**
     * Fixed opening direction
     */
    openDirection: {
      type: String,
      default: 'auto',
    },

    /**
     * Whether to automatically open the menu when the control is clicked
     */
    openOnClick: {
      type: Boolean,
      default: true,
    },

    /**
     * Whether to automatically open the menu when the control is focused
     */
    openOnFocus: {
      type: Boolean,
      default: false,
    },

    /**
     * Array of available options
     * @type {Object[]}
     */
    options: {
      type: Array,
    },

    /**
     * Field placeholder, displayed when there's no value.
     */
    placeholder: {
      type: String,
      default: 'Select...',
    },

    /**
     * Whether to retain the scroll position on menu reopen
     */
    retainScrollPosition: {
      type: Boolean,
      default: true,
    },

    /**
     * Text displayed asking user whether to retry loading children options
     */
    retryText: {
      type: String,
      default: 'Retry?',
    },

    /**
     * Title for the retry button
     */
    retryTitle: {
      type: String,
      default: 'Click to retry',
    },

    /**
     * Enable searching feature?
     */
    searchable: {
      type: Boolean,
      default: true,
    },

    /**
     * Whether to show a children count next to the label of each branch node
     */
    showCount: {
      type: Boolean,
      default: false,
    },

    /**
     * Used in pairs with `showCount` specifying what count should be displayed.
     * Acceptable values:
     *   - "ALL_CHILDREN"
     *   - "ALL_DESCENDANTS"
     *   - "LEAF_CHILDREN"
     *   - "LEAF_DESCENDANTS"
     */
    showCountOf: {
      type: String,
      default: ALL_CHILDREN,
      validator(value) {
        const acceptableValues = [ ALL_CHILDREN, ALL_DESCENDANTS, LEAF_CHILDREN, LEAF_DESCENDANTS ]
        return acceptableValues.indexOf(value) !== -1
      },
    },

    /**
     * Whether to show children count when searching.
     * Fallbacks to the value of `showCount` when not specified.
     * @type {boolean}
     */
    showCountOnSearch: null,

    /**
     * In which order the selected options should be displayed.
     * Acceptable values:
     *   - "ORDER_SELECTED"
     *   - "LEVEL"
     *   - "INDEX"
     */
    sortValueBy: {
      type: String,
      default: ORDER_SELECTED,
      validator(value) {
        const acceptableValues = [ ORDER_SELECTED, LEVEL, INDEX ]
        return acceptableValues.indexOf(value) !== -1
      },
    },

    /**
     * Tab index of the control
     */
    tabIndex: {
      type: Number,
      default: 0,
    },

    /**
     * An array of node ids or node objects as the initial field value.
     * The format depends on the ${v('valueFormat')} prop.
     * @type {?Array}
     */
    value: null,

    /**
     * Which kind of nodes should be included in the value array in multi-select mode
     * Acceptable values:
     *   - "ALL" - Any node that is checked will be included in the `value` array
     *   - "BRANCH_PRIORITY" (default) - If a branch node is checked, all its descendants will be excluded in the `value` array
     *   - "LEAF_PRIORITY" - If a branch node is checked, this node itself and its branch descendants will be excluded from the `value` array but its leaf descendants will be included
     */
    valueConsistsOf: {
      type: String,
      default: BRANCH_PRIORITY,
      validator(value) {
        const acceptableValues = [ ALL, BRANCH_PRIORITY, LEAF_PRIORITY ]
        return acceptableValues.indexOf(value) !== -1
      },
    },

    /**
     * Format of `value` prop
     * Acceptable values:
     *   - "id"
     *   - "object"
     */
    valueFormat: {
      type: String,
      default: 'id',
    },
  },

  data() {
    return {
      normalizedOptions: null, // normalized options tree
      selectedNodeIds: this.extractCheckedNodeIdsFromValue(),
      nodeCheckedStateMap: Object.create(null), // used for multi-select mode
      nodeMap: Object.create(null), // map: nodeId -> node
      selectedNodeMap: Object.create(null),
      isFocused: false, // whether the control has been focused
      isOpen: false, // whether the menu is open
      rootOptionsLoaded: false,
      loadingRootOptions: false,
      loadingRootOptionsError: '',
      noSearchResults: true, // whether there is any matching search result
      searchingCount: Object.create(null),
      searching: false,
      searchQuery: '',
      lastScrollPosition: 0,
      optimizedHeight: 0,
      prefferedOpenDirection: 'below',
    }
  },

  computed: {
    /* eslint-disable valid-jsdoc */
    /**
     * Normalized options that has been selected
     * @type {Object[]}
     */
    selectedNodes() {
      return this.selectedNodeIds.map(this.getNode)
    },
    /**
     * Id list of selected nodes with `sortValueBy` prop applied
     * @type {nodeId[]}
     */
    internalValue() {
      let internalValue

      if (this.single || this.flat || this.valueConsistsOf === ALL) {
        internalValue = this.selectedNodeIds.slice()
      } else if (this.valueConsistsOf === BRANCH_PRIORITY) {
        internalValue = this.selectedNodeIds.filter(id => {
          const node = this.getNode(id)
          if (node.isRootNode) return true
          return !this.isSelected(node.parentNode)
        })
      } else if (this.valueConsistsOf === LEAF_PRIORITY) {
        internalValue = this.selectedNodeIds.filter(id => {
          const node = this.getNode(id)
          if (node.isLeaf) return true
          return node.children.length === 0
        })
      }

      if (this.sortValueBy === LEVEL) {
        internalValue.sort((a, b) => sortValueByLevel(this.getNode(a), this.getNode(b)))
      } else if (this.sortValueBy === INDEX) {
        internalValue.sort((a, b) => sortValueByIndex(this.getNode(a), this.getNode(b)))
      }

      return internalValue
    },
    /**
     * Has any option been selected?
     * @type {boolean}
     */
    hasValue() {
      return this.internalValue.length > 0
    },
    /**
     * Has any undisabled option been selected?
     * @type {boolean}
     */
    hasUndisabledValue() {
      return this.hasValue && this.internalValue.map(this.getNode).some(node => !node.isDisabled)
    },
    /**
     * Whether is single-select mode or not
     * @type {boolean}
     */
    single() {
      return !this.multiple
    },
    /**
     * Options displayed in the control, the upper limit of number of which is
     * equal to the value of `limit` prop
     * @type {Object[]}
     */
    visibleValue() {
      return this.internalValue.map(this.getNode).slice(0, this.limit)
    },
    /**
     * Whether has passed the defined limit or not
     * @type {boolean}
     */
    hasExceededLimit() {
      return this.internalValue.length > this.limit
    },
    /**
     * Should the "×" icon be shown?
     * @type {boolean}
     */
    shouldShowX() {
      return this.clearable && !this.disabled && this.hasUndisabledValue
    },
    /**
     * Should show children count when searching?
     * @type {boolean}
     */
    showCountOnSearchComputed() {
      // Vue not allows set default prop value based on another prop value
      // so use computed property as a workaround
      return typeof this.showCountOnSearch === 'boolean'
        ? this.showCountOnSearch
        : this.showCount
    },
    /* eslint-enable valid-jsdoc */
  },

  watch: {
      options(newValue){
          this.initialize(newValue)
      },
    alwaysOpen(newValue) {
      if (newValue) this.openMenu()
      else this.closeMenu()
    },

    disabled(newValue) {
      // force close the menu after disabling the control
      if (newValue && this.isOpen) this.closeMenu()
      if (!newValue && !this.isOpen && this.alwaysOpen) this.openMenu()
    },

    multiple(newValue) {
      if (newValue) {
        // needs to rebuild the state tree when switching from
        // single-select mode to multi-select mode
        this.buildNodeCheckedStateMap()
      }
    },

    searchQuery: debounce(function onSearchQueryChange() {
      this.handleSearch()
      this.$emit('search-change', this.searchQuery, this.id)
    }, INPUT_DEBOUNCE_DELAY),

    internalValue() {
      this.$emit('input', this.getValue(), this.id)
    },

    value() {
      const newInternalValue = this.extractCheckedNodeIdsFromValue()
      const hasChanged = quickDiff(newInternalValue, this.internalValue)

      if (hasChanged) {
        this.selectedNodeIds = newInternalValue
        this.completeSelectedNodeIdList()
        this.buildSelectedNodeMap()
        this.buildNodeCheckedStateMap()
      }
    },
  },

  methods: {
    verifyProps() {
      warning(
        () => this.autofocus === false,
        () => '`autofocus` prop is deprecated. Use `autoFocus` instead.'
      )

      if (!this.loadRootOptions) {
        if (!this.options) {
          warning(
            () => false,
            () => 'Required prop `options` is not provided.'
          )
        } else if (!Array.isArray(this.options)) {
          warning(
            () => false,
            () => `Expected prop \`options\` to be an array, instead got: ${this.options}.`
          )
        }
      }
    },

    resetFlags() {
      this._blurOnSelect = false
      this._wasClickedOnValueItem = false
    },

    initialize(rootOptions) {
      if (Array.isArray(rootOptions)) {
        this.rootOptionsLoaded = true
        this.initializeRootOptions(rootOptions)
        this.completeSelectedNodeIdList()
        this.buildSelectedNodeMap()
        this.buildNodeCheckedStateMap()
      } else {
        this.initializeRootOptions([])
      }
    },

    getValue() {
      if (this.valueFormat === 'id') {
        return this.multiple
          ? this.internalValue.slice()
          : this.internalValue[0]
      }

      const rawNodes = this.internalValue.map(id => this.getNode(id).raw)
      return this.multiple ? rawNodes : rawNodes[0]
    },

    getNode(nodeId) {
      warning(
        () => nodeId != null,
        () => `Invalid node id: ${nodeId}`
      )

      if (nodeId == null) return null

      return nodeId in this.nodeMap
        ? this.nodeMap[nodeId]
        : this.createFallbackNode(nodeId)
    },

    createFallbackNode(id) {
      // in case there is a default selected node that is not loaded into the tree yet
      // we create a fallback node to keep the component working
      // when the real data is loaded, we'll override this fake node

      const raw = this.extractNodeFromValue(id)
      const label = this.normalizer(raw).label || `${id} (unknown)`
      const fallbackNode = {
        id,
        label,
        ancestors: [],
        parentNode: NO_PARENT_NODE,
        isFallbackNode: true,
        isRootNode: true,
        isLeaf: true,
        isBranch: false,
        isDisabled: false,
        index: [ -1 ],
        level: 0,
        raw,
      }

      this.$set(this.nodeMap, id, fallbackNode)
      return fallbackNode
    },

    extractCheckedNodeIdsFromValue() {
      if (this.value == null) return []

      if (this.valueFormat === 'id') {
        return this.multiple
          ? this.value.slice()
          : [ this.value ]
      }

      return (this.multiple ? this.value : [ this.value ])
        .map(node => this.normalizer(node))
        .map(node => node.id)
    },

    extractNodeFromValue(id) {
      const defaultNode = { id }

      if (this.valueFormat === 'id') {
        return defaultNode
      }

      const valueArray = this.multiple
        ? Array.isArray(this.value) ? this.value : []
        : this.value ? [ this.value ] : []
      const matched = find(
        valueArray,
        node => node && this.normalizer(node).id === id
      )

      return matched || defaultNode
    },

    completeSelectedNodeIdList() {
      const nodeIds = this.selectedNodeIds.slice()
      this.selectedNodeIds = []
      this.nodeCheckedStateMap = Object.create(null)
      this.selectedNodeMap = Object.create(null)
      nodeIds.forEach(id => {
        if (this.selectedNodeIds.indexOf(id) === -1) {
          this._selectNode(this.getNode(id), { ignoreDisabled: true })
        }
      })
    },

    isSelected(node) {
      // whether a node is selected (single-select mode) or fully-checked (multi-select mode)
      return this.selectedNodeMap[node.id] === true
    },

    checkIfBranchNode(node) {
      warning(
        () => node && node.isBranch,
        /* istanbul ignore next */
        () => `Expected a branch node, instead got: ${node}`
      )
    },

    stringifyValue(value) {
      return typeof value === 'string'
        ? value
        : (value !== null && JSON.stringify(value)) || ''
    },

    traverseDescendantsBFS(parentNode, callback) {
      this.checkIfBranchNode(parentNode)

      const queue = parentNode.children.slice()
      while (queue.length) {
        const currNode = queue[0]
        if (currNode.isBranch) queue.push(...currNode.children)
        callback(currNode)
        queue.shift()
      }
    },

    traverseDescendants(parentNode, maxLevel, callback) {
      if (typeof maxLevel === 'function') {
        callback = maxLevel
        maxLevel = Infinity
      }

      if (parentNode.isBranch && parentNode.level < maxLevel) {
        parentNode.children.forEach(child => {
          // DFS + post-order traversal
          this.traverseDescendants(child, maxLevel, callback)
          callback(child)
        })
      }
    },

    traverseAncestors(childNode, callback) {
      const { parentNode } = childNode

      if (parentNode !== NO_PARENT_NODE) {
        // pre-order traversal
        callback(parentNode)
        this.traverseAncestors(parentNode, callback)
      }
    },

    traverseAllNodes(callback) {
      this.normalizedOptions.forEach(rootNode => {
        // post-order traversal
        this.traverseDescendants(rootNode, callback)
        callback(rootNode)
      })
    },

    toggleClickOutsideEvent(enabled) {
      if (enabled) {
        document.addEventListener('mousedown', this.handleClickOutside, false)
      } else {
        document.removeEventListener('mousedown', this.handleClickOutside, false)
      }
    },

    focusInput() {
      this.$refs.value.focusInput()
    },

    blurInput() {
      this.$refs.value.blurInput()
    },

    handleMouseDown: onlyOnLeftClick(function handleMouseDown(evt) {
      evt.preventDefault()
      evt.stopPropagation()

      if (this.disabled) return

      const isClickedOnValueWrapper = this.$refs.value.$el.contains(evt.target)

      if (isClickedOnValueWrapper) {
        if (this.isOpen && !this.searchable && !this._wasClickedOnValueItem) {
          this.closeMenu()
        } else if (!this.isOpen && (this.openOnClick || this.isFocused)) {
          this.openMenu()
        }
      }

      if (this._blurOnSelect) {
        this.blurInput()
      } else {
        // focus the input or prevent blurring
        this.focusInput()
      }

      this.resetFlags()
    }),

    handleMouseDownOnClear: onlyOnLeftClick(function handleMouseDownOnClear(evt) {
      evt.stopPropagation()
      evt.preventDefault()

      this.clear()
      this.focusInput()
    }),

    handleMouseDownOnArrow: onlyOnLeftClick(function handleMouseDownOnArrow(evt) {
      evt.preventDefault()
      evt.stopPropagation()

      // focus the input or prevent blurring
      this.focusInput()
      this.toggleMenu()
    }),

    handleClickOutside(evt) {
      /* istanbul ignore else */
      if (this.$refs.wrapper && !this.$refs.wrapper.contains(evt.target)) {
        this.blurInput()
        this.closeMenu()
      }
    },

    handleSearch() {
      if (this.searchQuery) {
        // enter search mode
        this.searching = true
        this.noSearchResults = true
        // reset state
        this.traverseAllNodes(node => {
          if (node.isBranch) {
            node.expandsOnSearch = false
            node.hasMatchedChild = false
            this.$set(this.searchingCount, node.id, {
              [ALL_CHILDREN]: 0,
              [ALL_DESCENDANTS]: 0,
              [LEAF_CHILDREN]: 0,
              [LEAF_DESCENDANTS]: 0,
            })
          }
        })
        const lowerCasedSearchQuery = this.searchQuery.toLowerCase()
        this.traverseAllNodes(node => {
          const isMatched = node.isMatched = this.disableFuzzyMatching
            ? node.lowerCasedLabel.indexOf(lowerCasedSearchQuery) !== -1
            : fuzzysearch(lowerCasedSearchQuery, node.lowerCasedLabel)

          if (isMatched) {
            this.noSearchResults = false
            node.ancestors.forEach(ancestor => this.searchingCount[ancestor.id].ALL_DESCENDANTS++)
            if (node.isLeaf) node.ancestors.forEach(ancestor => this.searchingCount[ancestor.id].LEAF_DESCENDANTS++)
            if (node.parentNode !== NO_PARENT_NODE) {
              this.searchingCount[node.parentNode.id].ALL_CHILDREN += 1
              if (node.isLeaf) this.searchingCount[node.parentNode.id].LEAF_CHILDREN += 1
            }
          }

          if (
            (isMatched || (node.isBranch && node.expandsOnSearch)) &&
            node.parentNode !== NO_PARENT_NODE
          ) {
            node.parentNode.expandsOnSearch = true
            node.parentNode.hasMatchedChild = true
          }
        })
      } else {
        this.searching = false
        // TODO: need resetting state?
      }
    },

    closeMenu() {
      if (!this.isOpen || (!this.disabled && this.alwaysOpen)) return
      this.isOpen = false
      /* istanbul ignore else */
      if (this.retainScrollPosition) this.saveScrollPosition()
      this.toggleClickOutsideEvent(false)
      // reset search query after menu closes
      this.searchQuery = ''
      this.$emit('close', this.getValue(), this.id)
    },

    openMenu() {
      if (this.disabled || this.isOpen) return
      this.isOpen = true
      this.$nextTick(this.adjustPosition)
      /* istanbul ignore else */
      if (this.retainScrollPosition) this.$nextTick(this.restoreScrollPosition)
      if (!this.rootOptionsLoaded) this.loadOptions(true)
      this.toggleClickOutsideEvent(true)
      this.$emit('open', this.id)
    },

    toggleMenu() {
      if (this.isOpen) {
        this.closeMenu()
      } else {
        this.openMenu()
      }
    },

    toggleExpanded(node) {
      this.checkIfBranchNode(node)

      if (this.searching) {
        node.expandsOnSearch = !node.expandsOnSearch
      } else {
        node.isExpanded = !node.isExpanded
      }
    },

    initializeRootOptions(rootOptions) {
      this.normalizedOptions = this.normalize(NO_PARENT_NODE, rootOptions)
    },

    buildSelectedNodeMap() {
      const map = this.selectedNodeMap = Object.create(null)

      this.selectedNodeIds.forEach(selectedNodeId => {
        map[selectedNodeId] = true
      })
    },

    buildNodeCheckedStateMap() {
      const map = this.nodeCheckedStateMap = Object.create(null)
      if (this.single) return

      this.selectedNodes.forEach(selectedNode => {
        map[selectedNode.id] = CHECKED

        if (!this.flat) {
          this.traverseAncestors(selectedNode, ancestorNode => {
            if (!this.isSelected(ancestorNode)) {
              map[ancestorNode.id] = INDETERMINATE
            }
          })
        }
      })

      this.traverseAllNodes(node => {
        if (!(node.id in map)) {
          map[node.id] = UNCHECKED
        }
      })
    },

    normalize(parentNode, nodes) {
      let normalizedOptions = nodes
        .map(node => [ this.normalizer(node), node ])
        .map(([ node, raw ], index) => {
          this.checkDuplication(node)
          this.verifyNodeShape(node)

          const isRootNode = parentNode === NO_PARENT_NODE
          const { id, label, children, isDefaultExpanded } = node
          const lowerCasedLabel = label.toLowerCase() // used for option filtering
          const isDisabled = !!node.isDisabled || (!this.flat && !isRootNode && parentNode.isDisabled)
          const isBranch = (
            Array.isArray(children) ||
            children === null ||
            (children === undefined && !!node.isBranch)
          )
          const isLeaf = !isBranch
          const level = isRootNode ? 0 : parentNode.level + 1
          const isMatched = false
          const ancestors = isRootNode ? [] : parentNode.ancestors.concat(parentNode)
          const _index = (isRootNode ? [] : parentNode.index).concat(index)
          const normalized = {
            id,
            label,
            level,
            ancestors,
            index: _index,
            parentNode,
            lowerCasedLabel,
            isDisabled,
            isMatched,
            isLeaf,
            isBranch,
            isRootNode,
            raw,
          }

          if (isBranch) {
            const isLoaded = Array.isArray(children)
            if (!isLoaded) {
              warning(
                () => typeof this.loadChildrenOptions === 'function',
                () => 'Unloaded branch node detected. `loadChildrenOptions` prop is required to load its children.'
              )
            }

            normalized.isLoaded = isLoaded
            normalized.isPending = false
            normalized.isExpanded = typeof isDefaultExpanded === 'boolean'
              ? isDefaultExpanded
              : level < this.defaultExpandLevel
            normalized.hasMatchedChild = false
            normalized.hasDisabledDescendants = false
            normalized.expandsOnSearch = false
            normalized.loadingChildrenError = ''
            normalized.count = {
              [ALL_CHILDREN]: 0,
              [ALL_DESCENDANTS]: 0,
              [LEAF_CHILDREN]: 0,
              [LEAF_DESCENDANTS]: 0,
            }
            normalized.children = isLoaded
              ? this.normalize(normalized, children)
              : []

            if (normalized.isExpanded && !normalized.isLoaded) {
              this.loadOptions(false, normalized)
            }
          }

          normalized.ancestors.forEach(ancestor => ancestor.count.ALL_DESCENDANTS++)
          if (isLeaf) normalized.ancestors.forEach(ancestor => ancestor.count.LEAF_DESCENDANTS++)
          if (parentNode !== NO_PARENT_NODE) {
            parentNode.count.ALL_CHILDREN += 1
            if (isLeaf) parentNode.count.LEAF_CHILDREN += 1
          }

          if (isDisabled) {
            normalized.ancestors.forEach(ancestor => ancestor.hasDisabledDescendants = true)
          }

          this.$set(this.nodeMap, id, normalized)
          return normalized
        })

      if (this.branchNodesFirst) {
        const branchNodes = normalizedOptions.filter(option => option.isBranch)
        const leafNodes = normalizedOptions.filter(option => option.isLeaf)
        normalizedOptions = branchNodes.concat(leafNodes)
      }

      return normalizedOptions
    },

    loadOptions(isRootLevel, parentNode) {
      if (isRootLevel) {
        if (this.loadingRootOptions) return

        const callback = (err, data) => {
          this.loadingRootOptions = false

          if (err) {
            this.loadingRootOptionsError = err.message || /* istanbul ignore next */ String(err)
          } else if (!data) {
            this.loadingRootOptionsError = 'no data received'
          } else if (!Array.isArray(data)) {
            this.loadingRootOptionsError = 'received unrecognizable data'
          } else {
            this.initialize(data)
            this.rootOptionsLoaded = true
          }
        }

        this.loadingRootOptions = true
        this.loadingRootOptionsError = ''
        this.loadRootOptions(callback)
      } else {
        if (parentNode.isPending) return

        const rawData = parentNode.raw
        const callback = (err, children) => {
          parentNode.isPending = false

          if (err) {
            parentNode.loadingChildrenError = this.loadChildrenErrorText(err)
          } else if (!Array.isArray(children)) {
            parentNode.loadingChildrenError = 'Received unrecognizable data'
            warning(
              () => false,
              () => `Received unrecognizable data ${children} while loading children options of node ${parentNode.id}`
            )
          } else {
            parentNode.children = this.normalize(parentNode, children)
            parentNode.isLoaded = true
            this.completeSelectedNodeIdList()
            this.buildSelectedNodeMap()
            this.buildNodeCheckedStateMap()
          }
        }

        parentNode.isPending = true
        parentNode.loadingChildrenError = ''
        this.loadChildrenOptions(rawData, callback)
      }
    },

    checkDuplication(node) {
      warning(
        () => !(hasOwn(this.nodeMap, node.id) && !this.nodeMap[node.id].isFallbackNode),
        () => `Detected duplicate presence of node id ${JSON.stringify(node.id)}. ` +
          `Their labels are "${this.nodeMap[node.id].label}" and "${node.label}" respectively.`
      )
    },

    verifyNodeShape(/* node */) {
      // TODO
    },

    select(node) {
      if (node.isDisabled) return

      if (this.single) {
        this.clear()
      }

      const toggleFlag = this.multiple && !this.flat
        ? this.nodeCheckedStateMap[node.id] === UNCHECKED
        : !this.isSelected(node)

      if (toggleFlag) {
        this._selectNode(node)
      } else {
        this._deselectNode(node)
      }

      this.buildSelectedNodeMap()
      this.buildNodeCheckedStateMap()

      if (this.searching && toggleFlag && (this.single || this.clearOnSelect)) {
        this.searchQuery = ''
      }

      if (this.single && this.closeOnSelect) {
        this.closeMenu()

        if (this.searchable) {
          this._blurOnSelect = true
        }
      }
    },

    clear() {
      if (this.hasValue) {
        this.selectedNodeIds = this.multiple
          ? this.selectedNodeIds.filter(nodeId => this.getNode(nodeId).isDisabled)
          : []
        this.buildSelectedNodeMap()
        this.buildNodeCheckedStateMap()
      }
    },

    _selectNode(node, { ignoreDisabled = false } = {}) {
      if (this.single || this.flat || this.disableBranchNodes) {
        this.addValue(node)
        return
      }

      if (node.isLeaf || (node.isBranch && (!node.hasDisabledDescendants || ignoreDisabled))) {
        this.addValue(node)
      }

      if (node.isBranch) {
        this.traverseDescendantsBFS(node, descendant => {
          if (!descendant.isDisabled || ignoreDisabled) this.addValue(descendant)
        })
      }

      if (node.isLeaf || (node.isBranch && (!node.hasDisabledDescendants || ignoreDisabled))) {
        let curr = node
        while (!curr.isRootNode) {
          curr = curr.parentNode
          const siblings = curr.children
          if (siblings.every(this.isSelected)) {
            this.addValue(curr)
          } else {
            break
          }
        }
      }
    },

    _deselectNode(node) {
      if (this.single || this.flat || this.disableBranchNodes) {
        this.removeValue(node)
        return
      }

      let hasUncheckedSomeDescendants = false
      if (node.isBranch) {
        this.traverseDescendants(node, descendant => {
          if (!descendant.isDisabled) {
            this.removeValue(descendant)
            hasUncheckedSomeDescendants = true
          }
        })
      }

      if (node.isLeaf || hasUncheckedSomeDescendants) {
        this.removeValue(node)

        let curr = node
        while (!curr.isRootNode) {
          curr = curr.parentNode
          if (!this.isSelected(curr)) break
          this.removeValue(curr)
        }
      }
    },

    addValue(node) {
      this.selectedNodeIds.push(node.id)
      this.selectedNodeMap[node.id] = true
    },

    removeValue(node) {
      removeFromArray(this.selectedNodeIds, node.id)
      delete this.selectedNodeMap[node.id]
    },

    maybeRemoveLastValue() {
      /* istanbul ignore next */
      if (!this.hasValue) return
      const lastValue = last(this.selectedNodeIds)
      const lastSelectedNode = this.getNode(lastValue)
      this.removeValue(lastSelectedNode)
      this.buildSelectedNodeMap()
      this.buildNodeCheckedStateMap()
    },

    saveScrollPosition() {
      if (this.$refs.menu) this.lastScrollPosition = this.$refs.menu.scrollTop
    },

    restoreScrollPosition() {
      if (this.$refs.menu) this.$refs.menu.scrollTop = this.lastScrollPosition
    },

    adjustPosition() {
      // istanbul ignore next
      if (typeof window === 'undefined') return

      const rect = this.$el.getBoundingClientRect()
      const spaceAbove = rect.top
      const spaceBelow = window.innerHeight - rect.bottom
      const hasEnoughSpaceBelow = spaceBelow > this.maxHeight
      const isInViewport = spaceBelow > -40

      switch (true) {
      case hasEnoughSpaceBelow:
      case spaceBelow > spaceAbove:
      case !isInViewport:
      case this.openDirection === 'below':
      case this.openDirection === 'bottom':
        this.prefferedOpenDirection = 'below'
        this.optimizedHeight = Math.max(Math.min(spaceBelow - 40, this.maxHeight), this.maxHeight)
        break

      default:
        this.prefferedOpenDirection = 'above'
        this.optimizedHeight = Math.min(spaceAbove - 40, this.maxHeight)
      }
    },
  },

  created() {
    this.verifyProps()
    this.resetFlags()
    this.initialize(this.options)
  },

  mounted() {
    if (this.autoFocus || this.autofocus) this.$refs.value.focusInput()
    if (!this.rootOptionsLoaded && this.autoLoadRootOptions) this.loadOptions(true)
    if (this.alwaysOpen) this.openMenu()
  },

  destroyed() {
    /* istanbul ignore next */
    this.toggleClickOutsideEvent(false)
  },
}
