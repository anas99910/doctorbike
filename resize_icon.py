from PIL import Image

def resize_logo(input_path, output_path, size=(512, 512), padding_factor=0.8):
    try:
        img = Image.open(input_path).convert("RGBA")
        
        # Calculate aspect ratio
        original_width, original_height = img.size
        aspect_ratio = original_width / original_height
        
        # Determine new dimensions based on the max dimension allowed
        # User requested "fit to circle" like Instagram, so we ZOOM IN (scale > 1.0)
        # to ensure the logo fills the entire circular area.
        scale_factor = 1.25 
        max_dim = int(min(size) * scale_factor)
        
        if aspect_ratio > 1:
            new_width = max_dim
            new_height = int(max_dim / aspect_ratio)
        else:
            new_height = max_dim
            new_width = int(max_dim * aspect_ratio)
            
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Create a new transparent image
        new_img = Image.new("RGBA", size, (0, 0, 0, 0))
        
        # Paste the resized logo into the center
        paste_x = (size[0] - new_width) // 2
        paste_y = (size[1] - new_height) // 2
        
        new_img.paste(img, (paste_x, paste_y), img)
        
        new_img.save(output_path, "PNG")
        print(f"Successfully saved optimized icon to {output_path}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    resize_logo("assets/logo.png", "assets/google-touch-icon.png")
