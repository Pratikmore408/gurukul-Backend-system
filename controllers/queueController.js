// queueController.js
export const enqueueRequest = async (req, res) => {
  const { ...request } = req.body;
  const user = req.user;

  try {
    const channel = req.app.locals.channel;
    const queueName = `requests_client_${user._id}`;

    // Assert that the client-specific queue exists
    await channel.assertQueue(queueName);

    // Send the request to the client-specific queue
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(request)));

    return res.status(202).send("request enqueued successfully");
  } catch (error) {
    res.status(500).send("Error enqueuing request " + error);
  }
};
