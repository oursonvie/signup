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



    ]
  }

  return docPDF

}
