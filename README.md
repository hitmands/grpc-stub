# @hitmands/grpc-stub

Simple gRPC Stub Server

- <https://hub.docker.com/r/hitmands/grpc-stub>

## Getting Started

### Folder Structure

You are only required to mount a volume named `/services` whose shape matches:

```shell
/proto/*.proto
/services.definition.js
```

<details>
  <summary>How to structure the definition file?</summary>

<br />

- Look at how the [Heartbeat](./lib/heartbeat/heartbeat.mjs) service has been defined
- Look at our [Example-Services](./example-services)

```ts
/* /services.definition.js */

const SayHello = (call, callback) => {
  const { name } = call.request;

  return callback(null, { message: `Howdy ${name}, welcome aboard!` });
};

const greeter = () => ({
  protoPath: "/services/proto/greeter.proto",
  packageName: "greeter",
  serviceName: "Greet",
  options: {
    keepCase: false,
  },
  routes: {
    SayHello,
  },
});

module.exports = [greeter /* ... */] as StubbedService[];
```

```proto
/* /proto/greeter.proto */

syntax="proto3";

package greeter;

service Greet {
  rpc SayHello (SayHelloRequest) returns (SayHelloResponse) {}
}

message SayHelloRequest {
  string name = 1;
}

message SayHelloResponse {
  string message = 1;
}
```

```ts
type StubbedService = () => StubbedServiceOptions;

type RouteName = string;

type RouteHandler = (call, callback) => void;

interface StubbedServiceOptions {
  /**
   * The name of your package as stated in the protofile (e.g. 'grpc_stub')
   */
  packageName: string;

  /**
   * The name of your service as stated in the protofile (e.g. 'Heartbeat')
   */
  serviceName: string;

  /**
   * The path to your protofile (e.g. '/services/proto/greeter.proto')
   */
  protoPath: string;

  /**
   * The gRPC Server Options (optional)
   */
  options?: {
    keepCase?: true;
    longs?: String;
    enums?: String;
    defaults?: true;
    oneofs?: true;
  };

  /**
   * An object whose keys should match rpc method names (as defined in the protofile)
   * and whose values should be their related callbacks.
   */
  routes: Record<RouteName, RouteHandler>;
}
```

</details>

### Running the StubServer

```shell
docker run -tid \
  -p 3333:3333 \
  -v $(pwd)/example-services:/services \
  hitmands/grpc-stub:latest
```

## Testing

- You can download the [`heartbeat.proto`](https://raw.githubusercontent.com/hitmands/grpc-stub/main/lib/heartbeat/heartbeat.proto)

```shell
brew install grpcurl
```

```shell
grpcurl \
  -proto heartbeat.proto \
  -plaintext \
  -d '{}' \
  127.0.0.1:3333 grpc_stub.Heartbeat/Liveness

grpcurl \
  -proto heartbeat.proto \
  -plaintext \
  -d '{ "left": 23, "right": 66 }' \
  127.0.0.1:3333 grpc_stub.Heartbeat/Sum
```
