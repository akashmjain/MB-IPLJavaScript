class Data {
    setData(data) {
        this.data = data;
    }
    getData() {
        return this.data;
    }
}


const d = new Data();
d.setData("Akash");
console.log(d.getData());