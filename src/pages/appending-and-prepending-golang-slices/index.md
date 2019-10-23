#### Quick tip

Take a simple slice of structs:

```go
type Post struct {
  Name string
  ID   int
}

var list []Post
```

Appending uses the builtin keyword `append`

```go
var list []Post
item1 := Post{Name: "first", ID: 0}
item2 := Post{Name: "second", ID: 1}

list = append(list, item1)
len(list)
// > 1

list = append(list, item2)

len(list)
// > 2
```


#### Prepending

This is where things get interesting.

The [append](https://golang.org/pkg/builtin/#append) function "merges" or conacts an item to a slice.

Type signature:

`func append(slice []Type, elems ...Type) []Type`

By inverting the order and creating a slice with a single element we can use a variadic interface to destructure the original slice.

```go

item1 := Post{Name: "first", ID: 0}
item2 := Post{Name: "second", ID: 1}

list = append(list, item1)

fmt.Println(list[0])
// {0, first}


list = append([]Post{item2}, list...)
fmt.Println(list[0])
// {1, second}

```

Happy affixing
