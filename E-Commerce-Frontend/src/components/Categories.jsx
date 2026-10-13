import {
  LayoutGrid,
  Smartphone,
  Shirt,
  Footprints,
  Home,
  Sparkles,
  Watch,
  ShoppingBag,
} from "lucide-react";

// Map category names (from backend) to icons
const ICON_MAP = {
  All:          LayoutGrid,
  Electronics:  Smartphone,
  Clothing:     Shirt,
  Fashion:      Shirt,
  Shoes:        Footprints,
  "Home & Living": Home,
  Home:         Home,
  Sports:       Footprints,
  Beauty:       Sparkles,
  Accessories:  Watch,
  General:      ShoppingBag,
};

function Categories({ selectedCategory, setSelectedCategory, categories = [] }) {
  // Build list with icons — fall back to ShoppingBag for unknown names
  const categoryList = categories.map((name) => ({
    name,
    icon: ICON_MAP[name] || ShoppingBag,
  }));

  if (categoryList.length === 0) return null;

  const handleCategoryClick = (name) => {
    setSelectedCategory(name);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="categories-section" id="categories">
      <div className="categories-container">

        <div className="categories-heading">
          <p className="section-label">SHOP BY CATEGORY</p>
          <h2>Find What You Need</h2>
          <p>Explore our carefully selected categories.</p>
        </div>

        <div className="categories-list">
          {categoryList.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                className={`category-item ${
                  selectedCategory === category.name ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="category-icon">
                  <Icon size={25} />
                </div>
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Categories;