### path.resolve()和path.join()区别
- path.join()
    1. path.join()方法可以连接任意多个路径字符串。要连接的多个路径可做为参数传入。
    2. path.join()方法在接边路径的同时也会对路径进行规范化
    ```
    var path = require('path'); 
    //合法的字符串连接 
    path.join('/foo', 'bar', 'baz/asdf', 'quux', '..') 
    // 连接后 
    '/foo/bar/baz/asdf' 

    //不合法的字符串将抛出异常 
    path.join('foo', {}, 'bar') 
    // 抛出的异常 TypeError: Arguments to path.join must be strings'
    ```
- path.resolve()
    1. path.resolve()方法可以将多个路径解析为一个规范化的绝对路径。其处理方式类似于对这些路径逐一进行cd操作，与cd操作不同的是，这引起路径可以是文件，并且可不必实际存在（resolve()方法不会利用底层的文件系统判断路径是否存在，而只是进行路径字符串操作）
    ```
    path.resolve('/foo/bar', './baz') 
    // 输出结果为 
    '/foo/bar/baz' 
    path.resolve('/foo/bar', '/tmp/file/')
    // 输出结果为 
    '/tmp/file' 

    path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif') 
    // 当前的工作路径是 /home/itbilu/node，则输出结果为 
    '/home/itbilu/node/wwwroot/static_files/gif/image.gif'
    ```

