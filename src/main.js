// const div = document.createElement('div');
const div = dom.create("<div id='parent'>newDiv</div>");
console.log(div);

dom.after(test,div);


const div3 = dom.create('<div id="parent"></div>');
dom.wrap(test,div3);


const nodes = dom.empty(window.empty);
console.log(nodes);

dom.attr(test,'title','hi');//三个数修改值
const title = dom.attr(test,'title');//两个数获取值
console.log(`title:${title}`);

dom.text(test,'你好');


