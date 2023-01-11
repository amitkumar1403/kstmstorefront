import cn from 'classnames'
import s from './FeatureBar.module.css'

interface FeatureBarProps {
  className?: string
  title: string
  description?: string
  hide?: boolean
  action?: React.ReactNode
}

const FeatureBar: React.FC<FeatureBarProps> = ({
  title,
  description,
  className,
  action,
  hide,
}) => {
  const rootClassName = cn(
    s.root,
    {
      transform: true,
      'translate-y-0 opacity-100 cokkie-msg-sec shadow-md': !hide,
      'translate-y-full opacity-0 hidden cokkie-msg-sec': hide,
    },
    className
  )
  return (
    <div className={rootClassName}>
      <span className="block md:inline text-black text-xs py-4 text-center">{title}</span>
      <span className="block mb-6 md:block w-full md:mb-0 md:ml-2">
        {description}
      </span>
      {action && action}
    </div>
  )
}

export default FeatureBar
