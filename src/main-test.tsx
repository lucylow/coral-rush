import { createRoot } from 'react-dom/client'

const App = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#1e293b', color: 'white', minHeight: '100vh' }}>
      <h1>RUSH Test</h1>
      <p>If you can see this, React is working!</p>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
