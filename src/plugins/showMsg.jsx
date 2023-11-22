import { styled } from '@styils/vue';
import { ElButton } from 'element-plus'

const DivModel = styled('div',{
  position: 'fixed',
  width: '100%',
  height: '100%',
  left: 0,
  top: 0,
  zIndex: 999,
  background: '#00000050',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
const DivBox = styled('div',{
  backgroundColor: '#fff',
  color: '#333',
  padding: '1em 2em',
  borderRadius: '10px',
  boxShadow:' 0 0 3px #00000050',
  minWidth: '30%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})
const SpanMsg = styled('span',{
  margin:'10px'
})

const MessageBox = {
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  render(ctx) {
    const {$props,$emit} = ctx
    return (
      <DivModel>
        <DivBox>
          <SpanMsg>{ $props.msg }</SpanMsg>
          <ElButton type='primary' click={$emit('onClick')}>确定</ElButton>
        </DivBox>
      </DivModel>
    )
  }
}

function showMsg(msg, clickHandler) {
  const div = document.createElement('div')
  document.body.appendChild(div)
  // 渲染messageBox组件
  const app = createApp(MessageBox, {
    msg,
    onClick() {
      clickHandler &
        clickHandler(() => {
          app.unmount(div)
          div.remove()
        })
    },

  })
  app.mount(div)
}

export default showMsg
