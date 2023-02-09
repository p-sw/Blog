export default function Form({children, action, method, submitHandler}) {
  return <>
    <form action={action} method={method} onSubmit={submitHandler}>
      {children}
    </form>
    <style jsx>{`
      form {
        width: 100%;
        height: 100%;
      }
    `}</style>
  </>
}