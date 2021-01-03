import { render } from "@testing-library/react"
import { tw } from "twind"
import "../src/macro"

test("simple", () => {
	const result = render(<button tw="bg-blue-500" />)
	expect(result.container.firstChild).toHaveClass("bg-blue-500")
})

test("complex", () => {
	const condition = Math.random() > 0.5

	const result = render(
		<button
			tw={["bg-blue-500", condition && "text-white", { "leading-none": true }]}
		/>,
	)

	expect(result.container.firstChild).toHaveClass(
		`bg-blue-500 leading-none ${condition ? "text-white" : ""}`,
		{ exact: true },
	)
})

test("existing tw import", () => {
	const buttonClass = tw`bg-blue-500`
	const result = render(<button tw={[buttonClass, "text-red-500"]} />)

	expect(result.container.firstChild).toHaveClass("bg-blue-500 text-red-500", {
		exact: true,
	})
})
