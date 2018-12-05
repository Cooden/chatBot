var util = require('../../utils/util.js')
Page({
  //定义初始化数据  每当数据发生变化时，会自动触发页面循环
  data: {
    inputValue: '',
    returnValue: '',
    allContentList: [],
    key: "d13b441029804ee99fc4e3b617a5f557",
    access_token: '',
    num: 0,
    session_id: 1,
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
    var words = new Array("我想想","望路山瀑布", "诗", "嗯", "忆江南", "登高", "白居易", "李白", "笑话", "故事", "赋得古原草送别", "忆江南", "钱塘湖春行", "赠汪伦", "蜀道难", "将进酒", "绝句", "望岳", "江畔独步寻花", "琵琶行", "春望", "静夜思", "行路难");
    for(var i=0;i<words.length;i++){
       if (outsider.data.inputValue.indexOf(words[i]) > -1) {
        outsider.Unit(e);
         i=words.length;
         console.log('unit');
         return;
       }
     }
    outsider.chatterbot(e);
  },

  Unit: function(e){
    let outsider = this;
    var session = "{\"session_id\":\""+outsider.data.session_id+"\"}";
    //outsider.data.
    let _url = 'https://aip.baidubce.com/rpc/2.0/unit/bot/chat?access_token=' + outsider.data.access_token;
    wx.request({
      url: _url,
      data: {
        "bot_session": abc,
        "request": {
          "bernard_level": 1,
          "user_id": "88888",
          "client_session": "{\"client_results\":\"\", \"candidate_options\":[]}",
          //"client_session": {"client_results":"", "candidate_options":[]},
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
  chatterbot: function(e){
    let outsider = this;
    let _url = `http://handcong.cc/get_response`
    // console.log(_url);
    wx.request({
      url: _url,
      data: {
        user_input: outsider.data.inputValue
      },
      //封装返回数据格式
      header: {
        'Content-Type': 'application/json'
      },
      //请求成功的回调
      success: function (res) {
        let data = res.data;
        var say = unescape(data.response.replace(/\\u/g, '%u'));
        console.log(say);
        outsider.data.allContentList.push({ "value": say});
        //调用set方法，告诉系统数据已经改变启动循环，循环聊天信息
        outsider.setData({
          returnValue: say,
          allContentList: outsider.data.allContentList
        })
      }
    })
  },


  onLoad: function() {
    let that = this;
    wx.setNavigationBarTitle({
      title: '聊天机器人24小时在线',
      navigationBarBackgroundColor: 'blue',
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