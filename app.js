// Core App Namespace
window.App = (function() {
  // Utilities
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function createSvgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  // -------------------- Red-Black Tree --------------------
  const RED = 0; const BLACK = 1;
  class RbtNode {
    constructor(key, color = RED) {
      this.key = key;
      this.color = color; // 0 red, 1 black
      this.left = null; this.right = null; this.parent = null;
    }
  }

  class RedBlackTree {
    constructor() { this.nil = new RbtNode(null, BLACK); this.root = this.nil; }

    leftRotate(x) {
      const y = x.right;
      x.right = y.left;
      if (y.left !== this.nil) y.left.parent = x;
      y.parent = x.parent;
      if (x.parent === this.nil) this.root = y;
      else if (x === x.parent.left) x.parent.left = y;
      else x.parent.right = y;
      y.left = x;
      x.parent = y;
    }

    rightRotate(y) {
      const x = y.left;
      y.left = x.right;
      if (x.right !== this.nil) x.right.parent = y;
      x.parent = y.parent;
      if (y.parent === this.nil) this.root = x;
      else if (y === y.parent.left) y.parent.left = x;
      else y.parent.right = x;
      x.right = y;
      y.parent = x;
    }

    insert(key) {
      const z = new RbtNode(key, RED);
      z.left = this.nil; z.right = this.nil; z.parent = this.nil;
      let y = this.nil; let x = this.root;
      while (x !== this.nil) {
        y = x; x = z.key < x.key ? x.left : x.right;
      }
      z.parent = y;
      if (y === this.nil) this.root = z;
      else if (z.key < y.key) y.left = z; else y.right = z;
      this.insertFixup(z);
    }

    insertFixup(z) {
      while (z.parent.color === RED) {
        if (z.parent === z.parent.parent.left) {
          const y = z.parent.parent.right;
          if (y.color === RED) {
            z.parent.color = BLACK; y.color = BLACK; z.parent.parent.color = RED; z = z.parent.parent;
          } else {
            if (z === z.parent.right) { z = z.parent; this.leftRotate(z); }
            z.parent.color = BLACK; z.parent.parent.color = RED; this.rightRotate(z.parent.parent);
          }
        } else {
          const y = z.parent.parent.left;
          if (y.color === RED) {
            z.parent.color = BLACK; y.color = BLACK; z.parent.parent.color = RED; z = z.parent.parent;
          } else {
            if (z === z.parent.left) { z = z.parent; this.rightRotate(z); }
            z.parent.color = BLACK; z.parent.parent.color = RED; this.leftRotate(z.parent.parent);
          }
        }
      }
      this.root.color = BLACK;
      this.root.parent = this.nil;
    }

    transplant(u, v) {
      if (u.parent === this.nil) this.root = v;
      else if (u === u.parent.left) u.parent.left = v; else u.parent.right = v;
      v.parent = u.parent;
    }

    minimum(x) { while (x.left !== this.nil) x = x.left; return x; }
    findMin() { if (this.root === this.nil) return null; return this.minimum(this.root).key; }

    search(key) {
      let x = this.root;
      while (x !== this.nil && x.key !== key) x = key < x.key ? x.left : x.right;
      return x === this.nil ? null : x;
    }

    delete(key) {
      const z = this.search(key);
      if (!z) return false;
      let y = z; let yOriginalColor = y.color; let x;
      if (z.left === this.nil) { x = z.right; this.transplant(z, z.right); }
      else if (z.right === this.nil) { x = z.left; this.transplant(z, z.left); }
      else {
        y = this.minimum(z.right); yOriginalColor = y.color; x = y.right;
        if (y.parent === z) x.parent = y; else { this.transplant(y, y.right); y.right = z.right; y.right.parent = y; }
        this.transplant(z, y); y.left = z.left; y.left.parent = y; y.color = z.color;
      }
      if (yOriginalColor === BLACK) this.deleteFixup(x);
      return true;
    }

    deleteFixup(x) {
      while (x !== this.root && x.color === BLACK) {
        if (x === x.parent.left) {
          let w = x.parent.right;
          if (w.color === RED) { w.color = BLACK; x.parent.color = RED; this.leftRotate(x.parent); w = x.parent.right; }
          if (w.left.color === BLACK && w.right.color === BLACK) { w.color = RED; x = x.parent; }
          else {
            if (w.right.color === BLACK) { w.left.color = BLACK; w.color = RED; this.rightRotate(w); w = x.parent.right; }
            w.color = x.parent.color; x.parent.color = BLACK; w.right.color = BLACK; this.leftRotate(x.parent); x = this.root;
          }
        } else {
          let w = x.parent.left;
          if (w.color === RED) { w.color = BLACK; x.parent.color = RED; this.rightRotate(x.parent); w = x.parent.left; }
          if (w.right.color === BLACK && w.left.color === BLACK) { w.color = RED; x = x.parent; }
          else {
            if (w.left.color === BLACK) { w.right.color = BLACK; w.color = RED; this.leftRotate(w); w = x.parent.left; }
            w.color = x.parent.color; x.parent.color = BLACK; w.left.color = BLACK; this.rightRotate(x.parent); x = this.root;
          }
        }
      }
      x.color = BLACK;
    }

    removeMin() {
      if (this.root === this.nil) return null;
      const m = this.minimum(this.root);
      const key = m.key; this.delete(key); return key;
    }

    toTree() { return this.root; }
  }

  // -------------------- Binomial Heap --------------------
  class BinomialNode {
    constructor(key) { this.key = key; this.degree = 0; this.parent = null; this.child = null; this.sibling = null; }
  }
  class BinomialHeap {
    constructor() { this.head = null; }
    mergeRootLists(h1, h2) {
      let head = null, tail = null; let a = h1, b = h2;
      while (a || b) {
        let pick;
        if (!b || (a && a.degree <= b.degree)) { pick = a; a = a ? a.sibling : null; }
        else { pick = b; b = b ? b.sibling : null; }
        if (!head) { head = tail = pick; } else { tail.sibling = pick; tail = pick; }
      }
      return head;
    }
    union(other) {
      let head = this.mergeRootLists(this.head, other.head);
      // clear inputs to avoid accidental reuse
      this.head = null; other.head = null;
      if (!head) { this.head = null; return; }
      let prev = null;
      let curr = head;
      let next = curr.sibling;
      while (next) {
        if (curr.degree !== next.degree || (next.sibling && next.sibling.degree === curr.degree)) {
          prev = curr; curr = next;
        } else if (curr.key <= next.key) {
          // make next a child of curr
          curr.sibling = next.sibling;
          this.link(next, curr);
        } else {
          // make curr a child of next
          if (!prev) head = next; else prev.sibling = next;
          this.link(curr, next);
          curr = next;
        }
        next = curr.sibling;
      }
      this.head = head;
    }
    link(y, z) { y.parent = z; y.sibling = z.child; z.child = y; z.degree++; }
    insert(key) { const h = new BinomialHeap(); h.head = new BinomialNode(key); this.union(h); }
    findMinNode() { let y = null; let x = this.head; let min = Infinity; while (x) { if (x.key < min) { min = x.key; y = x; } x = x.sibling; } return y; }
    findMin() { const n = this.findMinNode(); return n ? n.key : null; }
    extractMin() {
      if (!this.head) return null;
      let prevMin = null, minNode = this.head, prev = null, curr = this.head;
      let min = curr.key;
      while (curr) { if (curr.key < min) { min = curr.key; prevMin = prev; minNode = curr; } prev = curr; curr = curr.sibling; }
      if (prevMin) prevMin.sibling = minNode.sibling; else this.head = minNode.sibling;
      let child = minNode.child; let rev = null;
      while (child) { const next = child.sibling; child.parent = null; child.sibling = rev; rev = child; child = next; }
      const h = new BinomialHeap(); h.head = rev; this.union(h);
      return minNode.key;
    }
    decreaseKey(node, newKey) { if (!node || newKey > node.key) return false; node.key = newKey; let y = node, z = y.parent; while (z && y.key < z.key) { const t = y.key; y.key = z.key; z.key = t; y = z; z = y.parent; } return true; }
    delete(key) { const node = this.findNodeByKey(key); if (!node) return false; this.decreaseKey(node, -Infinity); this.extractMin(); return true; }
    findNodeByKey(key) { function dfs(n) { if (!n) return null; if (n.key === key) return n; return dfs(n.child) || dfs(n.sibling); } return dfs(this.head); }
  }

  // -------------------- Fibonacci Heap --------------------
  class FibNode {
    constructor(key) { this.key = key; this.degree = 0; this.parent = null; this.child = null; this.left = this; this.right = this; this.mark = false; }
  }
  class FibonacciHeap {
    constructor() { this.min = null; this.n = 0; }
    insert(key) {
      const x = new FibNode(key);
      if (!this.min) this.min = x; else { this.addToRootList(x); if (x.key < this.min.key) this.min = x; }
      this.n++;
    }
    addToRootList(x) { x.left = this.min; x.right = this.min.right; this.min.right.left = x; this.min.right = x; x.parent = null; }
    findMin() { return this.min ? this.min.key : null; }
    union(other) { if (!other.min) return; if (!this.min) { this.min = other.min; this.n = other.n; other.min = null; other.n = 0; return; } // concat root lists
      const aRight = this.min.right; const bLeft = other.min.left; this.min.right = other.min; other.min.left = this.min; aRight.left = bLeft; bLeft.right = aRight; if (other.min.key < this.min.key) this.min = other.min; this.n += other.n; other.min = null; other.n = 0; }
    extractMin() {
      const z = this.min; if (!z) return null;
      if (z.child) { let x = z.child; const start = x; do { const next = x.right; this.addToRootList(x); x.parent = null; x = next; } while (x !== start); }
      z.left.right = z.right; z.right.left = z.left;
      if (z === z.right) { this.min = null; } else { this.min = z.right; this.consolidate(); }
      this.n--; return z.key;
    }
    consolidate() {
      const A = new Array(Math.floor(Math.log2(this.n || 1)) + 3).fill(null);
      const nodes = [];
      if (this.min) { let x = this.min; do { nodes.push(x); x = x.right; } while (x !== this.min); }
      for (const w of nodes) {
        let x = w; let d = x.degree;
        while (A[d]) { let y = A[d]; if (x.key > y.key) { const t = x; x = y; y = t; } this.link(y, x); A[d] = null; d++; }
        A[d] = x;
      }
      this.min = null;
      for (const a of A) if (a) { if (!this.min) { a.left = a; a.right = a; this.min = a; } else { a.left = this.min; a.right = this.min.right; this.min.right.left = a; this.min.right = a; if (a.key < this.min.key) this.min = a; } }
    }
    link(y, x) { // make y child of x
      y.left.right = y.right; y.right.left = y.left;
      if (!x.child) { x.child = y; y.left = y; y.right = y; } else { y.left = x.child; y.right = x.child.right; x.child.right.left = y; x.child.right = y; }
      y.parent = x; x.degree++; y.mark = false;
    }
    decreaseKey(node, newKey) { if (!node || newKey > node.key) return false; node.key = newKey; const y = node.parent; if (y && node.key < y.key) { this.cut(node, y); this.cascadingCut(y); } if (this.min && node.key < this.min.key) this.min = node; return true; }
    cut(x, y) { if (y.child === x) y.child = x.right !== x ? x.right : null; x.left.right = x.right; x.right.left = x.left; y.degree--; this.addToRootList(x); x.parent = null; x.mark = false; }
    cascadingCut(y) { const z = y.parent; if (z) { if (!y.mark) y.mark = true; else { this.cut(y, z); this.cascadingCut(z); } } }
    findNodeByKey(key) { if (!this.min) return null; const visited = new Set(); const stack = [this.min]; while (stack.length) { const node = stack.pop(); if (visited.has(node)) continue; visited.add(node); let x = node; do { if (x.key === key) return x; if (x.child) stack.push(x.child); x = x.right; } while (x !== node); } return null; }
    delete(key) { const node = this.findNodeByKey(key); if (!node) return false; this.decreaseKey(node, -Infinity); this.extractMin(); return true; }
  }

  // -------------------- Renderer --------------------
  const svg = () => document.getElementById('viz');
  function clearSvg() { const v = svg(); while (v.firstChild) v.removeChild(v.firstChild); }
  function setInfo(html) { document.getElementById('info-panel').innerHTML = html; }

  function renderRbt(tree) {
    clearSvg();
    const root = tree.root;
    if (root === tree.nil) { setInfo('Empty tree'); return; }
    const v = svg();
    const levelGap = 90; const nodeGap = 36;
    const positions = new Map();
    let maxDepth = 0;
    function layout(node, depth) {
      if (node === tree.nil) return 0;
      maxDepth = Math.max(maxDepth, depth);
      const leftW = layout(node.left, depth + 1);
      const rightW = layout(node.right, depth + 1);
      const width = Math.max(1, leftW + 1 + rightW);
      positions.set(node, { depth, width, leftW });
      return width;
    }
    const totalWidth = layout(root, 0);
    const viewWidth = 1200; const viewHeight = 100 + (maxDepth + 1) * levelGap;
    v.setAttribute('viewBox', `0 0 ${viewWidth} ${viewHeight}`);
    function place(node, x, y, span) {
      if (node === tree.nil) return;
      const leftSpan = Math.max(1, positions.get(node).leftW) * nodeGap;
      const rightSpan = Math.max(1, positions.get(node).width - positions.get(node).leftW - 1) * nodeGap;
      if (node.left !== tree.nil) drawEdge(x, y, x - leftSpan, y + levelGap);
      if (node.right !== tree.nil) drawEdge(x, y, x + rightSpan, y + levelGap);
      drawNode(x, y, node.key, node.color === RED ? '#ef4444' : '#111827');
      place(node.left, x - leftSpan, y + levelGap, leftSpan);
      place(node.right, x + rightSpan, y + levelGap, rightSpan);
    }
    function drawEdge(x1, y1, x2, y2) { v.appendChild(createSvgEl('line', { x1, y1, x2, y2, class: 'edge' })); }
    function drawNode(cx, cy, key, fill) {
      const g = createSvgEl('g', { class: 'node' });
      const c = createSvgEl('circle', { cx, cy, r: 16, fill });
      const t = createSvgEl('text', {
        x: cx,
        y: cy,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        fill: '#ffffff',
        stroke: 'rgba(0,0,0,0.55)',
        'stroke-width': '0.8',
        style: 'paint-order: stroke fill;'
      });
      t.textContent = key;
      g.appendChild(c); g.appendChild(t); v.appendChild(g);
    }
    place(root, 600, 40, totalWidth * nodeGap);
    setInfo(`Nodes drawn. Min = ${tree.findMin()}`);
  }

  function renderBinomial(heap) {
    clearSvg(); const v = svg(); setInfo(`Min = ${heap.findMin() ?? 'N/A'}`);
    // Draw roots in a row, children downward
    let x = 80; const y = 60; const xStep = 140; const levelGap = 80; const nodeGap = 36;
    function drawTree(node, baseX, baseY) {
      if (!node) return 0;
      const g = createSvgEl('g', { class: 'node' });
      const c = createSvgEl('circle', { cx: baseX, cy: baseY, r: 16, fill: '#60a5fa' });
      const t = createSvgEl('text', { x: baseX, y: baseY + 4, 'text-anchor': 'middle' }); t.textContent = node.key;
      g.appendChild(c); g.appendChild(t); v.appendChild(g);
      let child = node.child; let i = 0; let width = 1;
      const childXs = [];
      while (child) { childXs.push(i++); child = child.sibling; }
      const total = Math.max(1, childXs.length);
      child = node.child; i = 0;
      while (child) {
        const cx = baseX + (i - (total - 1) / 2) * nodeGap * 2;
        const edge = createSvgEl('line', { x1: baseX, y1: baseY + 16, x2: cx, y2: baseY + levelGap - 16, class: 'edge' });
        edge.setAttribute('stroke', '#64748b'); edge.setAttribute('stroke-width', '2.5'); edge.setAttribute('stroke-linecap', 'round');
        v.appendChild(edge);
        drawTree(child, cx, baseY + levelGap); i++; width++;
        child = child.sibling;
      }
      return width;
    }
    let root = heap.head; while (root) { drawTree(root, x, y); x += xStep; root = root.sibling; }
  }

  function renderFibonacci(heap) {
    clearSvg(); const v = svg(); setInfo(`Min = ${heap.findMin() ?? 'N/A'}`);
    // Draw root list as a circle row, then children downward
    const roots = [];
    if (heap.min) { let r = heap.min; do { roots.push(r); r = r.right; } while (r !== heap.min); }
    let x = 100; const y = 80; const xStep = 160; const levelGap = 80; const nodeGap = 36;
    function drawSubtree(node, baseX, baseY) {
      const g = createSvgEl('g', { class: 'node' });
      const c = createSvgEl('circle', { cx: baseX, cy: baseY, r: 16, fill: '#60a5fa' });
      const t = createSvgEl('text', { x: baseX, y: baseY + 4, 'text-anchor': 'middle' }); t.textContent = node.key;
      g.appendChild(c); g.appendChild(t); v.appendChild(g);
      if (node.child) {
        const children = [];
        let ch = node.child; do { children.push(ch); ch = ch.right; } while (ch !== node.child);
        const total = children.length;
        children.forEach((child, i) => {
          const cx = baseX + (i - (total - 1) / 2) * nodeGap * 2;
          const edge = createSvgEl('line', { x1: baseX, y1: baseY + 16, x2: cx, y2: baseY + levelGap - 16, class: 'edge' });
          edge.setAttribute('stroke', '#64748b'); edge.setAttribute('stroke-width', '2.5'); edge.setAttribute('stroke-linecap', 'round');
          v.appendChild(edge);
          drawSubtree(child, cx, baseY + levelGap);
        });
      }
    }
    roots.forEach(r => { drawSubtree(r, x, y); x += xStep; });
  }

  // -------------------- Controller --------------------
  const state = {
    ds: 'rbt',
    rbt: new RedBlackTree(),
    binomial: new BinomialHeap(),
    fibonacci: new FibonacciHeap(),
  };

  function render() {
    switch (state.ds) {
      case 'rbt': renderRbt(state.rbt); break;
      case 'binomial': renderBinomial(state.binomial); break;
      case 'fibonacci': renderFibonacci(state.fibonacci); break;
    }
  }

  function bindControls() {
    const sel = document.getElementById('ds-select');
    const keyInput = document.getElementById('key-input');
    const newKeyInput = document.getElementById('newkey-input');
    const decBtn = document.getElementById('op-decrease');
    const onKey = () => parseInt(keyInput.value, 10);
    const onNewKey = () => parseInt(newKeyInput.value, 10);

    function syncVisibility() {
      // Hide decrease key controls when RBT is selected
      const hide = state.ds === 'rbt';
      decBtn.style.display = hide ? 'none' : '';
      newKeyInput.style.display = hide ? 'none' : '';
    }

    sel.addEventListener('change', () => { state.ds = sel.value; syncVisibility(); render(); });
    document.getElementById('op-insert').addEventListener('click', () => {
      const k = onKey(); if (Number.isNaN(k)) return;
      if (state.ds === 'rbt') state.rbt.insert(k);
      if (state.ds === 'binomial') state.binomial.insert(k);
      if (state.ds === 'fibonacci') state.fibonacci.insert(k);
      render();
    });
    document.getElementById('op-delete').addEventListener('click', () => {
      const k = onKey(); if (Number.isNaN(k)) return;
      if (state.ds === 'rbt') state.rbt.delete(k);
      if (state.ds === 'binomial') state.binomial.delete(k);
      if (state.ds === 'fibonacci') state.fibonacci.delete(k);
      render();
    });
    document.getElementById('op-findmin').addEventListener('click', () => {
      let min = null;
      if (state.ds === 'rbt') min = state.rbt.findMin();
      if (state.ds === 'binomial') min = state.binomial.findMin();
      if (state.ds === 'fibonacci') min = state.fibonacci.findMin();
      setInfo(`Min = ${min ?? 'N/A'}`);
    });
    document.getElementById('op-removemin').addEventListener('click', () => {
      if (state.ds === 'rbt') state.rbt.removeMin();
      if (state.ds === 'binomial') state.binomial.extractMin();
      if (state.ds === 'fibonacci') state.fibonacci.extractMin();
      render();
    });
    document.getElementById('op-decrease').addEventListener('click', () => {
      const k = onKey(); const nk = onNewKey(); if (Number.isNaN(k) || Number.isNaN(nk)) return;
      if (state.ds === 'binomial') { const node = state.binomial.findNodeByKey(k); if (node) state.binomial.decreaseKey(node, nk); }
      if (state.ds === 'fibonacci') { const node = state.fibonacci.findNodeByKey(k); if (node) state.fibonacci.decreaseKey(node, nk); }
      // decrease on RBT not typical; skip
      render();
    });
    document.getElementById('op-clear').addEventListener('click', () => {
      state.rbt = new RedBlackTree(); state.binomial = new BinomialHeap(); state.fibonacci = new FibonacciHeap(); render();
    });
    // initial visibility sync
    syncVisibility();
  }

  function init() { bindControls(); render(); }

  return { init };
})();


