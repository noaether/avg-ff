package ca.noae;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class ImageProcessor {

    /**
     * Reads an image from a file and returns a 2D array of [r, g, b] values for each pixel.
     *
     * @param filePath The path to the image file.
     * @return A 2D array where each element is an array of [r, g, b] values.
     * @throws IOException If an error occurs during file reading.
     */
    public static int[][][] getImagePixelRGBValues(String filePath) throws IOException {
        File file = new File(filePath);
        BufferedImage image = ImageIO.read(file);

        int width = image.getWidth();
        int height = image.getHeight();
        int[][][] rgbArray = new int[height][width][3];

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int rgb = image.getRGB(x, y);

                // Extract the color components
                int r = (rgb >> 16) & 0xFF;
                int g = (rgb >> 8) & 0xFF;
                int b = rgb & 0xFF;

                // Store the values in the array
                rgbArray[y][x][0] = r;
                rgbArray[y][x][1] = g;
                rgbArray[y][x][2] = b;
            }
        }

        return rgbArray;
    }

    public static void main(String[] args) {
        try {
            // Example usage
            String imagePath = "/home/noa/avg-ff/image.jpg";
            int[][][] rgbValues = getImagePixelRGBValues(imagePath);

            // Print some of the pixel values for verification
            System.out.println("RGB Values of the first pixel: " +
                    "[" + rgbValues[0][0][0] + ", " + rgbValues[0][0][1] + ", " + rgbValues[0][0][2] + "]");
        } catch (IOException e) {
            System.err.println("Error reading the image file: " + e.getMessage());
        }
    }
}
