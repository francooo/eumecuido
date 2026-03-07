const fetch = require('node-fetch');

async function testRegister() {
  try {
    console.log('Testing registration API...\n');
    
    const response = await fetch('http://192.168.18.149:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      })
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✓ Registration successful!');
    } else {
      console.log('\n✗ Registration failed:', data.error);
    }
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testRegister();
