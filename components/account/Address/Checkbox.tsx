export default function Checkbox(props: any) {
  const flexDirection = props.flexDirection || ''
  return (
    <div className={`w-1/2 py-5 flex ${flexDirection} items-center`}>
      <input
        name={`${props.formItem.name}-input[]`}
        defaultValue={props.values[props.formItem.name]}
        type="checkbox"
        className="h-4 w-4 border-gray-300 rounded filter-input"
      />

      <label
        htmlFor={`${props.formItem.name}-input[]`}
        onClick={(e) => {
          props.handleChange({
            target: {
              type: 'change',
              name: props.formItem.name,
              value: !props.values[props.formItem.name],
            },
          })
        }}
        className="cursor-pointer text-sm text-gray-500 relative filter-label"
      >
        {props.values[props.formItem.name] && (
          <div
            style={{
              content: '',
              float: 'left',
              left: '6px',
              top: '0px',
              zIndex: 99999,
              position: 'absolute',
              width: '10px',
              height: '14px',
              border: 'solid #000',
              borderWidth: '0 2px 2px 0',
              transform: 'rotate(45deg)',
            }}
          />
        )}
        <div
          style={{
            content: '',
            float: 'left',
            height: '20px',
            width: '20px',
            borderRadius: '2px',
            border: '1px solid #cacaca',
            position: 'relative',
            marginRight: '10px',
          }}
        />
      </label>
      <span className="text-gray-900">{props.formItem.label}</span>
    </div>
  )
}
