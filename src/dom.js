window.dom = {
    create(string){
        /*container 容器 template可以容纳任何标签*/
        const container = document.createElement("template");
        /*string.trim()表示把字符串前面的空格消除掉 */
        container.innerHTML = string.trim();
        /*返回容器内的第一个孩子 */
        return container.content.firstChild;
    },
    after(node,node2){
        /*找到节点的父亲把节点2放到节点1的下一个节点的前面，也就是节点2放到节点1的后面 */
        node.parentNode.insertBefore(node2,node.nextSibling);
    },
    before(node,node2){
        /*同上,把节点2放到节点1的前面 */
        node.parentNode.insertBefore(node2,node);
    },
    append(parent,node){
        /*父节点后添加子节点 */
        parent.appendChild(node);
    },
    wrap(node,parent){ /*创造父节点 */
        /*这里犯过错,这里调用的是新增各个接口,我们只是把node和parent赋值过去,内部还是把parent放到node的前面*/
        dom.before(node,parent);
        // console.log(parent);
        dom.append(parent,node);
    },
    remove(node){
        /*找到节点的父亲然后删除他的子节点 */
        node.parentNode.removeChild(node);
        //这里return的作用是返回被移除对象,然后通过let div=dom.remove(div),获取到被删除的元素
        return node;
    },
    empty(node){ /*移除这个节点下的所有子节点 */
        /*高级语法(解构赋值)类比：const childNodes = node.childNodes; 获取节点所有的子节点 */
        // const {childNodes} = node;

        const array = [];
        let x = node.firstChild;
        while(x){
            array.push(dom.remove(node.firstChild));
            //这里重新赋值时因为第一个子节点已经移除，这里已经是后面的子节点了
            x=node.firstChild;
        }

        // for(let i = 0;i<childNodes.length;i++){
        //     //这里不能用childNodes,它会实时更新,所以长度会实时变化
        //     dom.remove(childNodes[i]);
        //     //删除掉所有节点,想把删除的节点放到数组中保留
        //     array.push(childNodes[i]);
        // }
        // //返回数组,通过数组在把删除掉的子节点拿到

        return array;
    },
    attr(node,name,value){   //根据参数个数写不同的方法叫重载
        if(arguments.length === 3){
            //如果长度等于3，那么就修改值
            node.setAttribute(name,value);
        }else if(arguments.length ===2){
            //如果长度=2,就获取值
            return node.getAttribute(name);
        }
    },
    //arguments获取函数传递值的个数
    text(node,string){  //修改文本内容  根据不同的情况选用不同的方法就叫做：适配
        if(arguments.length===2){  //2个修改文本
            if('innerText' in node){ //看innerText方法在node里面吗
                node.innerHTML = string;
            }else{
                node.textContent = string;
            }
        }else if(arguments.length===1){  //1个读取文本
            if('innerText' in node){
                return node.innerText;
            }else{
                return node.textContent;
            }
        }
        
    },
    html(node,string){ //重载
        if(arguments === 2){
            node.innerHTML = string;
        }else if(arguments ===1){
            return node.innerHTML;
        }
    },
    style(node,name,value){
        if(arguments.length===3){
            //dom.style(div,'color','red')  修改单个值
            node.style[name] = value; 
        }else if(arguments ===2){
            //dom.style(div,'color')  读取值
            return node.style[name];
        }else if(name instanceof Object){ //如果name值属于对象
            //div.style(div,{color:'red'})
            const object = name;
            for(let key in object){  //如果key(color)值在name{color:'red'}里
                node.style[key] = object[key]; //节点的样式style的key值就替换成object里的key值  修改多个值 键值对  
            }
        }
    },
    class:{
        add(node,className){
            node.classList.add(className);
        },
        remove(node,className){
            node.classList.remove(className);
        },
        has(node,className){ //判断这个类值是否在这个类里
            return node.classList.contains(className);
        }
    },
    on(node,eventName,fn){ //附着节点监听
        node.addEventListener(eventName,fn);
    },
    off(node,eventName,fn){ //移除节点监听
        node,removeEventListener(eventName,fn);
    },

    //查
    find(selector,scope){ //查找某个元素在特定的id里吗？，如果不在就去document文本里找
        return (scope || document).querySelectorAll(selector);
    },
    parent(node){
        return node.parentNode;
    },
    children(node){
        return node.children;
    },
    siblings(node){
        //把node的子节点转换成数组然后遍历除自己外的所有子节点
        //filter函数表示过滤器，元素过滤掉自己
        return Array.from(node.parentNode.children).filter(n=>n!=node);
    },
    next(node){
        let x = node.nextSibling; //nextSibling表示node后面的数
        while(x.nodeType ===3){ //DOM里nodeType的3表示文本，如果是文本（空格回车）就下一个子元素
            x = x.nextSibling;
        }
        return x;
    },
    previous(node){
        let x = node.previousSibling; //表示node节点的上一个数
        while(x && x.nodeType === 3){ //如果x存在，且不是空格回车等
            x = x.previousSibling;
        }
        return x;
    },
    each(nodeList,fn){
        for(let i=0;i<nodeList.length;i++){
            fn.call(null,nodeList[i]); //null传的是this
        }
    },
    index(node){
        const list = dom.children(node.parentNode);
        let i;
        for(i=0;i<list.length;i++){
            if(list[i] === node){
                break;
            }
        }
        return i;
    }
    
};
