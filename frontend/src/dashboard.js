import React from 'react';

const Dashboard = () => {
  return (
    <div style={dashboardStyle}>
      <div style={boxStyle}>
        {/* Content for the first box */}
        <h2>Box 1</h2>
        <p>Content for Box 1 goes here.</p>
      </div>
      <div style={boxStyle}>
        {/* Content for the second box */}
        <h2>Box 2</h2>
        <p>Content for Box 2 goes here.</p>
      </div>
      <div style={boxStyle}>
        {/* Content for the third box */}
        <h2>Box 3</h2>
        <p>Content for Box 3 goes here.</p>
      </div>
      <div style={boxStyle}>
        {/* Content for the fourth box */}
        <h2>Box 4</h2>
        <p>Content for Box 4 goes here.</p>
      </div>
    </div>
  );
};

const dashboardStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gridTemplateRows: 'repeat(2, 1fr)',
  gap: '20px',
  height: '100vh',
};

const boxStyle = {
  backgroundColor: '#f0f0f0',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
};

export default Dashboard;
