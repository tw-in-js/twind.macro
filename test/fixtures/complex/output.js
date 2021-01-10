import { tw } from "twind"
export default (
	<button
		className={tw([
			"bg-blue-500",
			condition && "text-white",
			{
				"leading-none": true,
			},
		])}
	/>
)
