var util = require('../../utils/util.js')
Page({
  //定义初始化数据  每当数据发生变化时，会自动触发页面循环
  data: {
    inputValue: '',
    returnValue: '',
    allContentList: [],
    key: "d13b441029804ee99fc4e3b617a5f557",
    access_token: '',
    num: 0
  },
  //绑定键盘按下事件，讲输入的值赋给data
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },


  //点击发送按钮时触发事件
  submitTo: function(e) {
    let outsider = this;
    outsider.data.num++;
    //将输入数据追加到列表里面
    outsider.data.allContentList.push({
      "value": outsider.data.inputValue
    });
    console.log(outsider.data.allContentList);
    var words=new Array("白居易","李白","唐诗","笑话","故事");
    for(var i=0;i<words.length;i++){
       if (outsider.data.inputValue.indexOf(words[i]) > -1) {
        outsider.Unit(e);
         i=words.length;
         console.log('unit');
         return;
       }
     }
    outsider.tuling(e);
  },

  Unit: function(e){
    let outsider = this;
    let _url = 'https://aip.baidubce.com/rpc/2.0/unit/bot/chat?access_token=' + outsider.data.access_token;
    wx.request({
      url: _url,
      data: {
        "bot_session": "",
        "request": {
          "bernard_level": 1,
          "user_id": "88888",
          "client_session": "{\"client_results\":\"\", \"candidate_options\":[]}",
          "query": outsider.data.inputValue,
          "query_info": {
            "source": "KEYBOARD",
            "type": "TEXT"
          },
          "user_id": "88888"
        },
        "log_id": outsider.data.num,
        "bot_id": "15779",
        "version": "2.0",
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        let data = res.data;
        console.log(data);
        
        var response = data.result.response.action_list[0].say;
        console.log(response);
        outsider.data.allContentList.push({ "value": response });
        outsider.setData({
          returnValue: data.result.response.action_list[0].say,
          allContentList: outsider.data.allContentList
        });

      },
    });
  },
  tuling: function(e){
    let outsider = this;
    let _url = `https://www.tuling123.com/openapi/api`;
    wx.request({
      url: _url,
      data: {
        key: outsider.data.key,
        info: outsider.data.inputValue
      },
      //封装返回数据格式
      header: {
        'Content-Type': 'application/json'
      },
      //请求成功的回调
      success: function (res) {
        let data = res.data;
        if (data.code === 100000) {   //100000 表示返回成功
          outsider.data.allContentList.push({ "value": data.text });
          //调用set方法，告诉系统数据已经改变   启动循环，循环聊天信息
          outsider.setData({
            returnValue: data.text,
            allContentList: outsider.data.allContentList
          })
        } else {}
      }
    })
  },


  onLoad: function() {
    let that = this;
    wx.setNavigationBarTitle({
      title: '聊天机器人24小时在线',
      success: function() {
        // console.log("success")
      },
      fail: function() {
        // console.log("error")
      }
    })
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=mPI1kOYCwvPQw5b49admyVfR&client_secret=ZzGXgKADaZzZ51LYk9XdUCpLwdFRgGIh&',
      method: 'POST',
      //封装返回数据格式
      header: {
        'Content-Type': 'application/json'
      },
      
      //请求成功的回调
      success: function(res) {
        let data = res.data;
        console.log(data);

        that.setData({
          access_token: data.access_token,
        })
        console.log(that.data.access_token);
      }
    })
  }
})