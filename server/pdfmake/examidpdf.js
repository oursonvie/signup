makeExamId = (renderObject) => {
  // console.log(renderObject)

  let docPDF = {
    pageSize: 'A4',
    content: [

      {
        image: logoPng,
        width: 400,
        alignment: 'center',
        margin: [0, -10, 0, 0],
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
      	    fit: [150, 150],
            alignment: 'center'
      		}
  			],
        margin: [20, -20, 20, 0]
  		},

      {
  			margin: [20, -20, 20, 0],
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
  			],
        margin: [20, 0, 20, 0]
  		},

      {
        image: examRules,
        alignment: 'center',
        width: 600,
        margin: [20, -15, 20, 15]
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
