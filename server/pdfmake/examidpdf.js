makeExamId = (renderObject) => {
  // console.log(renderObject)

  let docPDF = {
    content: [

      {
        text: '西安交通大学',
        style: 'logo',
        alignment: 'center'
      },

      {
        text: '成人本科学士学位外国语考试',
        style: 'subheader',
        alignment: 'center'
      },

      {
        text: '准考证',
        style: 'header',
        alignment: 'center'
      },

      {
  			columns: [
  				{
            width: 90,
  					text: `
              学号 \n
              姓名 \n
              专业 \n
              层次 \n
              身份证号码 \n
              准考证号码 \n
            `
  				},
  				{
            width: 260,
  					text: `
            ${renderObject.studentid} \n
            ${renderObject.name} \n
            ${renderObject.degree} \n
            ${renderObject.level} \n
            ${renderObject.certno} \n
            ${renderObject.examid} \n
            `
  				},
          {
      	    image: renderObject.image,
      	    fit: [200, 200]
      		}
  			]
  		},

      {
  			style: 'tableExample',
  			table: {
          widths: ['auto', '*', '*', '*', '*', '*'],
  				body: [
  					['考试时间', '考试科目', '考场号', '座位号', '考场地址', '考试类型'],
  					[renderObject.examtime, renderObject.subject, renderObject.examroom, renderObject.seatno, renderObject.location, renderObject.examtype]
  				]
  			}
  		},

      {
  			columns: [
  				{
            width: 90,
  					text: `
              考点 \n
              地址 \n
            `
  				},
  				{
            width: 260,
  					text: `
            ${renderObject.place} \n
            ${renderObject.address} \n
            `
  				}
  			]
  		},

      {
        text: '考生须知',
			  style: 'header',
        alignment: 'center'
      },

      {
        text: `
          1、考生自行下载准考证，查看考场信息。\n
          2、考生应在前一天到考试地点了解考场有关的注意事项及考场具体位置。\n
          3、考生凭本人准考证和有效身份证件（军官证、护照、居民身份证）参加考试，缺一不可。\n
          4、开考前20分钟凭两证进入考场，对号入座。考试中须将两证放在课桌右上角接受检查。\n
          5、进入考场，只准带黑色签字笔、2B铅笔（用于填涂答题卡）、橡皮等必备工具，不得携带与考试有关的书籍、资料及其它任何物品。不得携带手机等通讯工具进入考场，违者按违纪处理。\n
          6、考生迟到15分钟后不得进入考场，考试结束前学生不得提前交卷离开考场。考试结束后，待监考教师将准考证、答题卡和试卷收齐后才能依次退场。\n
          7、试题有字迹不清，卷面缺损等，可举手提问。有关试题内容等问题不得向监考教师提问。\n
          8、考试中不得以任何方式作弊或帮助他人作弊，违者按规定予以处罚。\n
          9、遵守考场纪律，保持考场安静，不得吸烟，不得喧哗。\n
          10、考试期间，校园内不得停放校外车辆，请考生自行解决交通，按时考试。\n
        `,
        fontSize: 8
      },

      {
        text: '西安交通大学网络教育学院',
			  style: 'header',
        alignment: 'right'
      },

    ]
  }

  return docPDF

}
