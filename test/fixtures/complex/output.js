import { tw as _tw } from 'twind'
export default (
  <button
    className={
      /*#__PURE__*/ _tw([
        'bg-blue-500',
        condition && 'text-white',
        {
          'leading-none': true,
        },
      ])
    }
  />
)
