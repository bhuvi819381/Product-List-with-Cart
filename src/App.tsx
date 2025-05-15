import { useEffect } from "react";
import { useCartStore, Product } from "./stores/cartStore";
import ProductCard from "./components/ProductCard";
import CartSummary from "./components/CartSummary";
import Confirmation from "./components/Confirmation";

const App = () => {
  const { products, setProducts, showConfirmation } = useCartStore();

  // Fetch products from data.json
  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, [setProducts]);

  return (
    <div className="bg-Rose-50 min-h-screen text-Rose-900">
      <main className="mx-auto py-20 max-w-[1220px]">
        <div className="flex lg:flex-row flex-col gap-8">
          {/* Main content */}
          <section className="flex-1 p-[1rem]">
            <h1 className="mb-8 font-bold text-[2.5em] text-Rose-900">Desserts</h1>

            <ul className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-0 list-none">
              {products.map((product) => (
                <li key={product.name}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </section>

          {/* Cart summary */}
          <aside className="p-[1rem] lg:w-[350px]">
            <CartSummary />
          </aside>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmation && <Confirmation />}
    </div>
  );
};

export default App;
