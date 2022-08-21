// pages/maps/maps.js
//const chooseLocation = requirePlugin('chooseLocation');
let comm=require("../../utils/comm");
let disMin = Infinity;
let latMin=0;
let lngMin=0;
let indexMin=0;
let titleMin="";
let dirMin="";

let index=0;
let lat=0;
let lng=0;
let name="";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityList:[],
    markers:[],
    lat:35.252512,
    lng:115.417827,
  },
getPlace(){
  var name=titleMin
  var lat=latMin
  var lng=lngMin
  console.log(name,lat,lng)
  wx.navigateTo({
    url: "/pages/maproute/maproute?&name="+name+"&lat="+lat+"&lng="+lng
  })
},
searchArea(){
  var that =this;
  var latitude= this.data.markers[0].latitude;
  var longitude=this.data.markers[0].longitude;
  wx.request({
      url:"https://apis.map.qq.com/place_cloud/search/nearby?location="+this.data.lat+","+this.data.lng+"&page_size=25&radius=5000&auto_extend=1&orderby=x.price desc&table_id=0oM1EczHDEG4thbnW1&key=YLFBZ-47HLQ-R655T-GYRGY-BCZR6-NMFFX",
      success:function (res){
        console.log(res)
        var result=res.data.result
        if(result.count===0){
          wx.showToast({
            title: '五公里内无检测点！',
            icon: 'none',
            duration: 1500  
          })
        }else{
          result=res.data.result.data
          for(var i=0;i<result.length;i++){
            let lat=result[i].location.lat;
            let lng=result[i].location.lng;
            var index="markers["+(i+1)+"]";

            //计算距离
            var dis =Math.floor(comm.GetDistance(longitude,latitude,lng,lat));

            disMin=Math.min(dis,disMin);
            if(disMin===dis){
              latMin=lat;
              lngMin=lng;
              indexMin=i+1;
              titleMin=result[i].title;
            }
            that.setData({
              [index]:{
                id:1+i,
                latitude:lat,
                longitude:lng,
                iconPath:"../../images/地图.png",
                width:30,
                height:30,
                callout: {
                  content:result[i].title,
                  color: 'red',
                  fontsize: 20,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: 'white',
                  padding: 2,
                  display:'BYCLICK'
                }
              }
            })
          }
           //计算两点的方向，第二个点相对于第一个点的方向
          dirMin=comm.getDirection(latMin,lngMin,latitude,longitude);
          //console.log(disMin,latMin,lngMin,indexMin,titleMin,dirMin)

          wx.showModal({
            title: '最佳核酸检测点为'+result[indexMin-1].title,
            content: '它在你的'+dirMin+'方，是否前往',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: "/pages/maproute/maproute?&name="+result[indexMin-1].title+"&lat="+latMin+"&lng="+lngMin
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
         
        }
      }
    })
},
bindcallouttap(evt){
  //console.log(evt.detail.markerId)
  index=evt.detail.markerId
  console.log(this.data.markers[index].latitude,this.data.markers[index].longitude)
  lat=this.data.markers[index].latitude;
  lng=this.data.markers[index].longitude;
  name=this.data.markers[index].callout.content;
  wx.navigateTo({
    url: "/pages/maproute/maproute?&name="+name+"&lat="+lat+"&lng="+lng
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that=this
    wx.getLocation({
        success:function (res){
          console.log(res)
          that.setData({
            markers:[
              {
                id:0,
                latitude: res.latitude,
                longitude: res.longitude,
                iconPath:"../../images/地图-地标.png",
                width:30,
                height:30,
                callout:{
                  width:50,
                  height:40,
                  content:"当前位置",
                  color:'red',
                  fontsize:20,
                  borderRadius:5,
                  borderWidth:1,
                  borderColor:'white',
                  padding:2,
                  display:'ALWAYS'
                }
              }
            ]
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 此处加载数据，每次进入都加重新加载

  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
