import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy load the QrScanner component
const QrScanner = React.lazy(() => import('./components/QrScanner'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<QrScanner />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
