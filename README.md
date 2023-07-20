# Laddie

A fully type-safe compose function.

## What happens if the types are wrong?

When the next function's argument type
is not a subtype of the (potentially awaited)
previous function's return type an argument length error is risen:

```ts
compose(
  () => 5,
  (x: string) => x
  // ^ expected 1 argument, but got 2
)
```

However, this compiles successfully:

```ts
compose(
  () => 5,
  (x: number) => x
)
```

It's worth noting that the same does _not_ hold for functions that take no arguments:

```ts
compose(
  () => 1,
  () => 2
) // ok
```

## Usage

### Simple

```ts
import { compose } from 'laddie'

const increment = (a: number) => a + 1
const double = (a: number) => a * 2

compose(
  increment, // number => number
  double, // number => number
  String // any    => string
)(5) === String(double(increment(5)))
```

### Async

```ts
import { compose } from 'laddie'

interface Todo {
  name: string
  done: boolean
}

interface APIResponse {
  ok: boolean
  items: Todo[]
}

const fetchTodos = () => fetch(`/todos/all/`)
const parseResponse = (response: Response): Promise<APIResponse> =>
  response.json()
const extractItems = ({ items }: APIResponse) => items

// the type annotation is not necessary
const getTodos: () => Promise<Todo[]> = compose(
  fetchTodos,
  parseResponse,
  extractItems
)
```
