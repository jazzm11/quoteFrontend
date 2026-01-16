const BACKEND = process.env.BACKEND_URL; // backend VM IP

async function apiGet(path) {
  const response = await fetch(`${BACKEND}${path}`);
  return response.json();
}

async function apiPost(path, body) {
  const response = await fetch(`${BACKEND}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return { ...data, status: response.status, ok: response.ok };
}

async function apiEditQuote(path, body) {
  try {
    const response = await fetch(`${BACKEND}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return { ...data, status: response.status, ok: response.ok };
  } catch (error) {
    console.error("Error editing quote:", error);
    throw error;
  }
}

// Delete quote
async function apiDeleteQuote(path) {
  try {
    const response = await fetch(`${BACKEND}${path}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    return { ...data, status: response.status, ok: response.ok };
  } catch (error) {
    console.error('Error deleting quote:', error);
    throw error;
  }
}

module.exports = { apiGet, apiPost, apiEditQuote, apiDeleteQuote };
