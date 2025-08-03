import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"
import { cn } from "@/utils/cn"

const SearchBar = ({ 
  onSearch,
  placeholder = "Search...",
  className,
  ...props 
}) => {
  const [query, setQuery] = useState("")
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query.trim())
    }
  }
  
  const handleChange = (e) => {
    setQuery(e.target.value)
  }
  
  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" 
        />
        <Input
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-10 pr-4"
          {...props}
        />
      </div>
    </form>
  )
}

export default SearchBar