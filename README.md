# All Data Structure Visualizer

A comprehensive web-based visualization tool for various data structures, featuring interactive operations and real-time visual feedback.

## 🚀 Features

### Supported Data Structures

#### 1. **Red-Black Tree**
- **Insert**: Add new nodes with automatic balancing
- **Delete**: Remove nodes by key with rebalancing
- **Find Min**: Locate the minimum value
- **Remove Min**: Extract and remove the minimum value
- **Visual Features**: 
  - Color-coded nodes (red/black)
  - Automatic tree balancing visualization
  - Clear parent-child relationships

#### 2. **Binomial Heap**
- **Insert**: Add new elements
- **Delete**: Remove elements by key
- **Find Min**: Get the minimum value
- **Remove Min**: Extract minimum value
- **Decrease Key**: Modify existing key values
- **Visual Features**:
  - Hierarchical tree structure
  - Root list visualization
  - Parent-child relationships

#### 3. **Fibonacci Heap** ⭐ *Enhanced*
- **Insert**: Add new elements
- **Delete**: Remove elements by key
- **Find Min**: Get the minimum value
- **Remove Min**: Extract minimum value
- **Decrease Key**: Modify existing key values
- **Visual Features**:
  - **Minimum Pointer**: Orange arrow pointing to the minimum element
  - **Circular List Visualization**: Purple dashed lines showing doubly-linked list connections
  - **Linear Layout**: Clean horizontal arrangement of root nodes
  - **Sibling Connections**: Circular connections between child nodes
  - **Enhanced Highlighting**: Minimum node with distinct orange coloring

## 🎨 Visual Legend

| Element | Description |
|---------|-------------|
| 🔴 Red Circle | Red-Black Tree: Red node |
| ⚫ Black Circle | Red-Black Tree: Black node |
| 🔵 Blue Circle | Heap root nodes |
| 🟠 Orange Circle | Fibonacci Heap: Minimum node |
| 🟣 Purple Dashed Line | Fibonacci Heap: Circular list connections |
| 🟠 Orange Line | Fibonacci Heap: Minimum pointer |

## 🛠️ How to Use

1. **Select Data Structure**: Choose from the dropdown menu
2. **Enter Values**: Use the input fields for keys and operations
3. **Perform Operations**: Click buttons to insert, delete, find min, etc.
4. **Visual Feedback**: Watch real-time updates in the visualization area
5. **Clear**: Reset the data structure to start fresh

## 🔧 Operations

### Universal Operations
- **Insert**: Add a new element with the specified key
- **Delete**: Remove an element by its key
- **Find Min**: Display the minimum value without removing it
- **Remove Min**: Extract and remove the minimum value
- **Clear**: Reset the data structure

### Specialized Operations
- **Decrease Key**: Modify an existing key (Binomial & Fibonacci Heaps only)
  - Enter the current key in the first input
  - Enter the new key in the second input
  - Click "Decrease Key"

## 🎯 Key Features

### Interactive Interface
- **Real-time Visualization**: See changes instantly as you perform operations
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Intuitive Controls**: Easy-to-use buttons and input fields
- **Visual Feedback**: Clear indication of current state and operations

### Advanced Visualizations
- **Tree Structures**: Clear parent-child relationships with connecting lines
- **Heap Properties**: Visual representation of heap ordering
- **Circular Lists**: Fibonacci heap's doubly-linked list structure
- **Color Coding**: Distinct colors for different node types and states

## 🚀 Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/mananvsuri/All-Data-Structure.git
   cd All-Data-Structure
   ```

2. **Open in Browser**
   - Simply open `index.html` in any modern web browser
   - No additional setup or dependencies required

3. **Start Visualizing**
   - Select a data structure from the dropdown
   - Enter values and perform operations
   - Watch the real-time visualization updates

## 🌟 Recent Updates

### Fibonacci Heap Enhancements
- ✨ **Minimum Pointer**: Clear visual indication of the minimum element
- 🔗 **Circular List Visualization**: Shows doubly-linked list connections
- 📐 **Linear Layout**: Clean horizontal arrangement of nodes
- 🎨 **Enhanced Styling**: Better visual distinction and clarity

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Structure and semantic markup
- **CSS3**: Modern styling with animations and responsive design
- **JavaScript (ES6+)**: Core logic and data structure implementations
- **SVG**: Scalable vector graphics for visualizations

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Happy Visualizing!** 🎉