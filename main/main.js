const database= require("../main/datbase.js");
module.exports = function main(inputs) {
    var allitems =database.loadAllItems();//获取所有的商品信息
    var discount = database.loadPromotions(); //获取所有的折扣信息
    var items = receiptItems(inputs, allitems);
    var promotions = calPromotions(items, discount);
    var expecteText = printReceipt(items, promotions);
    console.log(expecteText);
};
function receiptItems(inputs, allitems) {  //输入商品条形码生成商品数组
    var items = []; //返回输入的对象数组
        inputs.forEach(item => {
        var item_barcode = item.split('-')[0] ? item.split('-')[0] : item;
        var item_count = item.split('-')[1] ? parseInt(item.split('-')[1], 10) : 1;
        for(var i = 0; i < items.length; i++) {
            if(item_barcode === items[i].barcode) {
                items[i].count += item_count;
                return;
            }
        }
        allitems.forEach(data => {
            if(item_barcode === data.barcode) {
                items.push({
                    barcode: item_barcode,
                    name: data.name,
                    count: item_count,
                    unit: data.unit,
                    price: data.price
                });
            }
        });
    });
    return items;
}
function calPromotions(items, discount) {   //得到优惠的商品数组
    var promotions = [];
    items.forEach(item => {
        if(discount[0].barcodes.includes(item.barcode )) {
            var promotion_count = Math.floor(item.count / 3);
            promotions.push({
                name: item.name,
                count: promotion_count,
                unit: item.unit
            });
        }
    });
    return promotions;
}
function printReceipt(items, promotions) {  //打印清单
    var menu_top= "***<没钱赚商店>购物清单***\n";
    var menu_middle = "挥泪赠送商品：\n";
    var total = 0;
    var total_promotion = 0;
    var total_str = '';
    items.forEach(item => {
        var total_price = item.count * item.price;
        promotions.forEach(elem => {
            if(elem.name === item.name) {
                total_price -= elem.count * item.price;//优惠后的价格
                total_promotion += elem.count * item.price;   //优惠的价格
                menu_middle += "名称：" + elem.name + "，数量：" + elem.count + elem.unit + "\n";
            }
        });
        menu_top +=  "名称：" + item.name + "，数量：" + item.count
            + item.unit + "，单价：" + item.price.toFixed(2) + "(元)，小计：" + total_price.toFixed(2) + "(元)\n";
        total += total_price;

    });
    total_str =  "总计：" + total.toFixed(2) + "(元)\n" +
        "节省：" + total_promotion.toFixed(2) + "(元)\n";
    var menu = menu_top +'----------------------\n'+ menu_middle +'----------------------\n'+ total_str +
        '**********************';
    return menu;
}