export default {
  type: 'bubble',
  hero: {
    type: 'image',
    url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
    size: 'full',
    aspectRatio: '20:13',
    aspectMode: 'cover'
  },
  body: {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'text',
        text: 'Brown Cafe',
        weight: 'bold',
        size: 'xl'
      },
      {
        type: 'box',
        layout: 'vertical',
        margin: 'lg',
        spacing: 'sm',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '實況精華',
                size: 'sm',
                color: '#eeeeee',
                weight: 'bold'
              }
            ],
            backgroundColor: '#C48486',
            width: '80px',
            alignItems: 'center',
            cornerRadius: '15px',
            paddingTop: '3px',
            paddingBottom: '3px',
            paddingStart: '5px',
            paddingEnd: '5px',
            background: {
              type: 'linearGradient',
              angle: '145deg',
              startColor: '#C48555',
              endColor: '#C48486'
            }
          },
          {
            type: 'box',
            layout: 'baseline',
            spacing: 'sm',
            contents: [
              {
                type: 'text',
                color: '#666666',
                size: 'sm',
                align: 'start',
                text: '多久前發表在'
              },
              {
                type: 'text',
                text: '熱門版',
                color: '#ce706c',
                size: 'md',
                align: 'start',
                weight: 'bold'
              }
            ],
            paddingTop: '8px'
          }
        ],
        offsetTop: '-5px'
      },
      {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '#@%$^$!$!@$#%',
            size: 'sm',
            wrap: false,
            weight: 'bold',
            decoration: 'underline',
            style: 'italic'
          }
        ],
        paddingTop: '5px'
      }
    ],
    backgroundColor: '#ffeeef'
  },
  footer: {
    type: 'box',
    layout: 'vertical',
    spacing: 'sm',
    contents: [
      {
        type: 'button',
        style: 'link',
        height: 'sm',
        action: {
          type: 'uri',
          label: '看內文去',
          uri: 'https://linecorp.com'
        },
        color: '#CE8086'
      }
    ],
    flex: 0,
    backgroundColor: '#EFE3D8'
  }
}
