export default function Footer() {
  return (
    <footer className="border-t py-4 mt-8">
      <div className="container text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} MySite. All rights reserved. | <a href="/contact" className="underline">Contact</a>
      </div>
    </footer>
  )
}
