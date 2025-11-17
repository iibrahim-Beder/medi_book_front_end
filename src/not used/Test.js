import React from "react";
import { Toaster, toast } from "react-hot-toast";

function App() {
  return (
    <div>
      {/* Toaster لازم يكون جوه أي component */}
        <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 5000,
            theme: {
              primary: 'red',
              secondary: 'black',
            },
          },
        }}
      />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 5000,
            theme: {
              primary: 'red',
              secondary: 'black',
            },
          },
        }}
      />


      {/* زر للتجربة */}
      <button onClick={() => toast.success("نجحت العملية! 🎉")}>
        إظهار Toast
      </button>
    </div>
  );
}

export default App;
