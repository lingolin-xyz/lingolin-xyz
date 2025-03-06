const BigTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-3xl md:text-4xl lg:text-5xl tracking-tight font-bold">
      {children}
    </div>
  )
}

export default BigTitle
