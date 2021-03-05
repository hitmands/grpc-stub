const SendMessage = (call, callback) => {
  const { message } = call.request;

  return callback(null, { message: `Answer to "${message}"` });
};

const SendMessageError = (call, callback) => {
  const { message } = call.request;

  return callback({
    message: `Cannot deliver message: "${message}"`,
    code: 500,
  });
};

const SayHello = (call, callback) => {
  const { name } = call.request;

  return callback(null, { message: `Hello "${name}"` });
};

const chat = () => ({
  packageName: "example",
  serviceName: "Chat",
  protoPath: "/services/proto/chat.proto",
  routes: {
    SendMessage,
    SendMessageError,
  },
});

const greeter = () => ({
  packageName: "example",
  serviceName: "Greeter",
  protoPath: "/services/proto/greeter.proto",
  routes: {
    SayHello,
  },
});

export default [chat, greeter];
