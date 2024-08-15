const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_BASE_URL } = process.env;

//Method to successfully fetch the node-fetch module.
const dynamicImportFetch = async () => {
  const fetchModule = await import('node-fetch');
  return fetchModule.default;
};

//Generate access token (from paypal API documentation)
generateAccessToken = async () => {
  try {
    const fetch = await dynamicImportFetch();

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error_description || "Failed to generate Access Token");
    }
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
    throw new Error("Failed to generate Access Token");
  }
};

//Handle the response (from paypal API documentation)
handleResponse = async (response) => {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
};

//Capture the order (from paypal API documentation)
captureOrder = async (orderID) => {
  const fetch = await dynamicImportFetch();
  const accessToken = await generateAccessToken();
  const url = `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};

//Create the order (from paypal API documentation)
createOrder = async (cart) => {
  console.log("Shopping cart information passed from the frontend createOrder() callback:", cart);

  const fetch = await dynamicImportFetch();
  const accessToken = await generateAccessToken();
  const url = `${PAYPAL_BASE_URL}/v2/checkout/orders`;

  const purchaseUnits = cart.map(item => ({
    amount: {
      currency_code: item.amount.currency_code, 
      value: item.amount.value, 
    },
  }));

  const payload = {
    intent: "CAPTURE",
    purchase_units: purchaseUnits,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

module.exports= {
  generateAccessToken,
  handleResponse,
  captureOrder,
  createOrder,
}